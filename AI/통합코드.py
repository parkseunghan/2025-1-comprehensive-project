# !pip install focal_loss

# -*- coding: utf-8 -*-
"""
📄 감기/감염/소화기/호흡기/심혈관 질병 예측 모델 (AI 기반 자가진단용)

이 스크립트는 증상 키워드, 수치/범주형 데이터를 기반으로 내과 질환을 예측하는
하이브리드 AI 모델(coarse-to-fine 구조)을 학습하고 추론하는 전체 파이프라인을 포함합니다.

✅ 주요 기능:
- SBERT 임베딩 기반 텍스트 처리
- MLP 기반 수치/카테고리 정보 통합
- 감기/감염/소화기/호흡기/심혈관 coarse 분류
- 각 coarse 그룹에 대한 fine 모델 분기 학습
- 위험도 점수 계산 및 응급도 분류
- 모델 저장 및 실시간 추론 기능 포함

🛠 구성:
- 전처리: preprocess_features(), preprocess_input()
- coarse 모델: build_model_coarse()
- fine 모델: train_fine_model() with config
- 추론: predict_disease()
- 저장: model.save()

작성자: [이승겸]
최종 수정일: 2025-04-15
"""


# ✅ 1. 필수 라이브러리 임포트

# ✅ 기본 라이브러리
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ✅ Scikit-learn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, MultiLabelBinarizer
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix

# ✅ TensorFlow & Keras
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Concatenate, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.losses import CategoricalCrossentropy

# ✅ 기타 외부 패키지
from focal_loss import SparseCategoricalFocalLoss

# ✅ 2. 전처리 함수 정의
def preprocess_features(df, sbert_embedding_path: str):
    # 📌 기본 정제
    df = df.copy()
    df.drop(columns=['symptom_text'], inplace=True, errors='ignore')
    df["disease_name"] = df["disease_name"].apply(lambda x: x[0] if isinstance(x, list) else x)

    # 📌 coarse 라벨 매핑
    coarse_map = {
        "감기": ["급성 기관지염", "급성 비인두염", "급성 인두염", "상기도 감염"],
        "감염": ["급성 장염", "간염", "요로감염"],
        "소화기": ["위염", "위식도역류질환(GERD)", "소화성 궤양", "췌장염", "과민성 대장증후군"],
        "호흡기": ["폐렴", "천식", "만성 폐쇄성 폐질환(COPD)"],
        "심혈관": ["심부전", "협심증", "빈혈"]
    }

    def map_coarse(name):
        for coarse, fine_list in coarse_map.items():
            if name in fine_list:
                return coarse
        return None

    df["coarse_label"] = df["disease_name"].apply(map_coarse)
    df.dropna(subset=["coarse_label"], inplace=True)
    df.reset_index(drop=True, inplace=True)

    # 📌 수치형 정규화
    numeric_cols = ["Age", "Height_cm", "Weight_kg", "BMI"]
    scaler = StandardScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

    # 📌 범주형 변환
    df["chronic_diseases"] = df["chronic_diseases"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
    df["medications"] = df["medications"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
    gender = df["Gender"].map({"남성": 1, "여성": 0}).fillna(0).values.reshape(-1, 1)

    mlb_chronic = MultiLabelBinarizer()
    mlb_meds = MultiLabelBinarizer()
    chronic_matrix = mlb_chronic.fit_transform(df["chronic_diseases"])
    meds_matrix = mlb_meds.fit_transform(df["medications"])

    # 📌 최종 MLP 피처
    mlp_features = np.concatenate([
        df[numeric_cols].values,
        gender,
        chronic_matrix,
        meds_matrix
    ], axis=1)

    # 📌 SBERT 임베딩 로딩 (동기화된 순서로 저장되어 있음)
    sbert_text_features = np.load(sbert_embedding_path)[:len(df)]
    text_features = sbert_text_features.astype(np.float32)

    return df, mlp_features, text_features, scaler, mlb_chronic, mlb_meds

df_raw = pd.read_csv("/content/leaned_train_dataset.csv", encoding="utf-8-sig")
df, mlp_features, text_features, scaler, mlb_chronic, mlb_meds = preprocess_features(df_raw, "leaned_sbert_text_features_final.npy")

# ✅ coarse 라벨 인코딩
le_coarse = LabelEncoder()
df["coarse_encoded"] = le_coarse.fit_transform(df["coarse_label"])
y_coarse = to_categorical(df["coarse_encoded"])

# ✅ 데이터 분할 (train → val → test)
X_mlp = mlp_features
X_text = text_features

X_train_val_mlp, X_test_mlp, X_train_val_text, X_test_text, y_train_val, y_test = train_test_split(
    X_mlp, X_text, y_coarse,
    test_size=0.15,
    stratify=df["coarse_encoded"],
    random_state=42
)

X_train_mlp, X_val_mlp, X_train_text, X_val_text, y_train, y_val = train_test_split(
    X_train_val_mlp, X_train_val_text, y_train_val,
    test_size=0.1765,  # → 0.15 / 0.85 ≈ 0.1765
    stratify=np.argmax(y_train_val, axis=1),
    random_state=42
)


# ✅ class_weight 계산
y_labels = np.argmax(y_train, axis=1)
weights = compute_class_weight(class_weight='balanced', classes=np.unique(y_labels), y=y_labels)
class_weights_dict = {i: w for i, w in enumerate(weights)}

# ✅ coarse 분류 모델 정의
def build_model_coarse(mlp_dim, text_dim, output_dim):
    mlp_input = Input(shape=(mlp_dim,), name='mlp_input')
    x1 = Dense(128, activation='relu')(mlp_input)
    x1 = BatchNormalization()(x1)
    x1 = Dropout(0.3)(x1)

    text_input = Input(shape=(text_dim,), name='bert_input')
    x2 = Dense(256, activation='relu')(text_input)
    x2 = Dropout(0.3)(x2)
    x2 = Dense(128, activation='relu')(x2)

    combined = Concatenate()([x1, x2])
    x = Dense(256, activation='relu')(combined)
    x = Dropout(0.4)(x)
    x = Dense(128, activation='relu')(x)
    output = Dense(output_dim, activation='softmax')(x)

    model = Model(inputs=[mlp_input, text_input], outputs=output)
    model.compile(
        optimizer=Adam(learning_rate=0.0005),
        loss=CategoricalCrossentropy(label_smoothing=0.1),
        metrics=['accuracy']
    )
    return model

# ✅ coarse 모델 학습
model_coarse = build_model_coarse(
    mlp_dim=mlp_features.shape[1],
    text_dim=text_features.shape[1],
    output_dim=y_coarse.shape[1]
)

model_coarse.fit(
    [X_train_mlp, X_train_text], y_train,
    validation_data=([X_val_mlp, X_val_text], y_val),
    epochs=50,
    batch_size=64,
    callbacks=[EarlyStopping(patience=5, restore_best_weights=True)],
    class_weight=class_weights_dict,
    verbose=1
)

# ✅ coarse 모델 평가
y_pred_proba = model_coarse.predict([X_test_mlp, X_test_text])
y_pred = np.argmax(y_pred_proba, axis=1)
y_true = np.argmax(y_test, axis=1)

# 📊 평가 리포트
print("\n📊 Classification Report:")
print(classification_report(y_true, y_pred, target_names=le_coarse.classes_))

# 🔍 Confusion Matrix
conf_mat = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(conf_mat, annot=True, fmt='d', cmap='Blues',
            xticklabels=le_coarse.classes_,
            yticklabels=le_coarse.classes_)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix - Coarse")
plt.show()

"""fine 모델 반복"""
# 🔹 coarse 그룹별 설정 파일 불러오기

with open("fine_config.json", "r", encoding="utf-8") as f:
    fine_config = json.load(f)

loss_map = {
    "categorical_crossentropy": "categorical_crossentropy",
    "focal": SparseCategoricalFocalLoss(gamma=2.0)
}

def train_fine_model(group_name, df, mlp_features, text_features):
    config = fine_config[group_name]
    df_sub = df[df["coarse_label"] == group_name].copy()
    df_sub["fine_label"] = df_sub["disease_name"]

    # 🔹 라벨 인코딩
    le_fine = LabelEncoder()
    df_sub["fine_encoded"] = le_fine.fit_transform(df_sub["fine_label"])

    # 🔹 라벨 형식 지정
    if config["output_type"] == "onehot":
        y = to_categorical(df_sub["fine_encoded"])
    else:
        y = df_sub["fine_encoded"].values  # 감염 그룹 focal용

    # 🔹 피처 구성
    idx = df_sub.index
    X_mlp = mlp_features[idx]
    X_text = text_features[idx]

    # 🔹 데이터 분할
    X_train_mlp, X_val_mlp, X_train_text, X_val_text, y_train, y_val = train_test_split(
        X_mlp, X_text, y,
        test_size=0.15,
        stratify=df_sub["fine_encoded"],
        random_state=42
    )

    # 🔹 class weight
    weights = compute_class_weight(class_weight='balanced',
                                   classes=np.unique(df_sub["fine_encoded"]),
                                   y=df_sub["fine_encoded"])
    class_weights_dict = {i: w for i, w in enumerate(weights)}

    # 🔹 모델 정의
    mlp_input = Input(shape=(X_mlp.shape[1],))
    x1 = Dense(64, activation='relu')(mlp_input)
    x1 = Dropout(0.2)(x1)

    text_input = Input(shape=(X_text.shape[1],))
    x2 = Dense(128, activation='relu')(text_input)
    x2 = Dropout(0.3)(x2)

    x = Concatenate()([x1, x2])
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    output = Dense(y.shape[1] if config["output_type"] == "onehot" else len(le_fine.classes_), activation='softmax')(x)

    model = Model(inputs=[mlp_input, text_input], outputs=output)
    model.compile(
        optimizer=Adam(0.0005),
        loss=loss_map[config["loss"]],
        metrics=["accuracy"]
    )

    # 🔹 학습
    model.fit(
        [X_train_mlp, X_train_text], y_train,
        validation_data=([X_val_mlp, X_val_text], y_val),
        epochs=30,
        batch_size=64,
        callbacks=[EarlyStopping(patience=5, restore_best_weights=True)],
        class_weight=class_weights_dict,
        verbose=1
    )

    # 🔹 평가
    y_pred = np.argmax(model.predict([X_val_mlp, X_val_text]), axis=1)
    y_true = np.argmax(y_val, axis=1) if config["output_type"] == "onehot" else y_val

    print(f"\n📊 {group_name} 그룹 fine 분류 결과:")
    print(classification_report(y_true, y_pred, target_names=le_fine.classes_))

    # 🔹 모델, 인코더 반환
    return model, le_fine

fine_models = {}
fine_label_encoders = {}

for group in fine_config:
    model, encoder = train_fine_model(group, df, mlp_features, text_features)
    fine_models[group] = model
    fine_label_encoders[group] = encoder

# 전처리 함수
def preprocess_input(input_dict, scaler, mlb_chronic, mlb_meds, sbert_model):
    gender_map = {"남성": 1, "여성": 0}

    # SBERT 임베딩
    text_embedding = sbert_model.encode([input_dict["symptom_keywords"]])[0].reshape(1, -1)

    # 수치형 스케일링
    num_input = np.array([
        input_dict["Age"],
        input_dict["Height_cm"],
        input_dict["Weight_kg"],
        input_dict["BMI"]
    ]).reshape(1, -1)
    num_scaled = scaler.transform(num_input)

    # 범주형 처리
    gender = np.array([[gender_map.get(input_dict["Gender"], 0)]])
    chronic_bin = mlb_chronic.transform([input_dict["chronic_diseases"]])
    meds_bin = mlb_meds.transform([input_dict["medications"]])

    # 최종 입력
    mlp_input = np.concatenate([num_scaled, gender, chronic_bin, meds_bin], axis=1)
    return mlp_input, text_embedding

# 위험도 계산 함수
def calculate_risk_score(input_dict, confidence):
    W1, W2, W3, W4, W5, W6 = 1, 1, 1, 1, 1, 1

    # 위험 요소 계산
    S = 1.0
    risk_diseases = ["고혈압", "당뇨", "심부전", "협심증"]
    C = 1.2 if any(d in input_dict["chronic_diseases"] for d in risk_diseases) else 1.0
    A = 1.2 if input_dict["Age"] >= 60 else 1.0
    G = 1.0
    B = 1.3 if input_dict["BMI"] < 18.5 or input_dict["BMI"] >= 25 else 1.0
    risk_meds = ["면역억제제", "항생제"]
    M = 1.1 if any(m in input_dict["medications"] for m in risk_meds) else 1.0

    score = confidence * (W1*S + W2*C + W3*A + W4*G + W5*B + W6*M)
    score = round(score, 2)

    # 등급 분류
    if score < 1.5:
        level, guide = "낮음", "현재 상태에서 자가 관리가 가능합니다."
    elif score < 3.0:
        level, guide = "보통", "전문가 상담을 권장합니다."
    elif score < 4.5:
        level, guide = "높음", "빠른 병원 방문이 필요합니다."
    else:
        level, guide = "응급", "즉시 응급실 방문이 필요합니다. 119에 연락하세요."

    return score, level, guide

# 통합 추론 함수
def predict_disease(input_dict, model_coarse, fine_models, le_coarse, fine_label_encoders,
                    scaler, mlb_chronic, mlb_meds, sbert_model):
    mlp_input, text_input = preprocess_input(input_dict, scaler, mlb_chronic, mlb_meds, sbert_model)

    # coarse 예측
    coarse_probs = model_coarse.predict([mlp_input, text_input])
    coarse_idx = np.argmax(coarse_probs)
    coarse_label = le_coarse.inverse_transform([coarse_idx])[0]

    # fine 예측
    fine_model = fine_models[coarse_label]
    fine_le = fine_label_encoders[coarse_label]
    fine_probs = fine_model.predict([mlp_input, text_input])
    fine_idx = np.argmax(fine_probs)
    fine_label = fine_le.inverse_transform([fine_idx])[0]
    confidence = round(float(fine_probs[0][fine_idx]), 4)

    # 위험도 계산
    risk_score, risk_level, recommendation = calculate_risk_score(input_dict, confidence)

    return {
    "coarse_label": coarse_label,
    "fine_prediction": fine_label,
    "confidence": confidence,
    "risk_score": risk_score,
    "risk_level": risk_level,
    "recommendation": recommendation
}


sample = {
    "symptom_keywords": "기침, 가래, 가슴 답답함",
    "Age": 50, "Gender": "남성", "Height_cm": 175, "Weight_kg": 80, "BMI": 26.1,
    "chronic_diseases": ["고혈압"],
    "medications": ["항생제"]
}

# sbert_model 선언 필요!
from sentence_transformers import SentenceTransformer
sbert_model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")


result = predict_disease(
    sample,
    model_coarse,
    fine_models,
    le_coarse,
    fine_label_encoders,
    scaler,
    mlb_chronic,
    mlb_meds,
    sbert_model
)

print(result)

# coarse 모델 저장
model_coarse.save("model_coarse.h5")

# fine 모델 저장
for group, model in fine_models.items():
    model.save(f"model_fine_{group}.h5")

