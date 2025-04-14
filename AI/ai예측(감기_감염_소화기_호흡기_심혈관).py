# -*- coding: utf-8 -*-
"""
리팩토링된 내과 질병 예측 AI 코드 (coarse-to-fine 구조)
- fine 모델 구조 통합
- 불필요한 임포트 제거
- coarse top-1 기반 예측 유지 (top-2 분기 적용은 옵션)
"""

# ✅ 필수 라이브러리
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Concatenate, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.utils import class_weight
from sklearn.metrics import classification_report
import joblib
from sentence_transformers import SentenceTransformer

# ✅ coarse 그룹 매핑
coarse_map = {
    "감기": ["급성 기관지염", "급성 비인두염", "급성 인두염", "상기도 감염"],
    "감염": ["급성 장염", "간염", "요로감염"],
    "소화기": ["위염", "위식도역류질환(GERD)", "소화성 궤양", "췌장염", "과민성 대장증후군"],
    "호흡기": ["폐렴", "천식", "만성 폐쇄성 폐질환(COPD)"],
    "심혈관": ["심부전", "협심증", "빈혈"]
}

# ✅ 전처리 함수

def preprocess(df):
    df.drop(columns=["symptom_text"], errors='ignore', inplace=True)
    df["disease_name"] = df["disease_name"].apply(lambda x: x[0] if isinstance(x, list) else x)

    def map_coarse(name):
        for coarse, fine_list in coarse_map.items():
            if name in fine_list:
                return coarse
        return None

    df["coarse_label"] = df["disease_name"].apply(map_coarse)
    df.dropna(subset=["coarse_label"], inplace=True)
    df.reset_index(drop=True, inplace=True)

    df["chronic_diseases"] = df["chronic_diseases"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
    df["medications"] = df["medications"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])

    return df

# ✅ 모델 정의 (공통 fine 모델 구조)

def build_fine_model(mlp_dim, text_dim, output_dim):
    mlp_input = Input(shape=(mlp_dim,), name='mlp_input')
    x1 = Dense(64, activation='relu')(mlp_input)
    x1 = Dropout(0.2)(x1)

    text_input = Input(shape=(text_dim,), name='text_input')
    x2 = Dense(128, activation='relu')(text_input)
    x2 = Dropout(0.3)(x2)

    x = Concatenate()([x1, x2])
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    output = Dense(output_dim, activation='softmax')(x)

    model = Model(inputs=[mlp_input, text_input], outputs=output)
    model.compile(optimizer=Adam(0.0005), loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# ✅ 전처리된 DataFrame 로딩 및 임베딩 불러오기
df = preprocess(pd.read_csv("leaned_train_dataset.csv", encoding="utf-8-sig"))

sbert_text_features = np.load("leaned_sbert_text_features_final.npy")[:len(df)]
text_features = tf.convert_to_tensor(sbert_text_features, dtype=tf.float32)

# ✅ 수치/범주형 피처 처리
scaler = StandardScaler()
df["BMI"] = df["Weight_kg"] / ((df["Height_cm"] / 100) ** 2)
numeric_cols = ["Age", "Height_cm", "Weight_kg", "BMI"]
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

gender = df["Gender"].map({"남성": 1, "여성": 0}).values.reshape(-1, 1)
mlb_chronic = MultiLabelBinarizer()
mlb_meds = MultiLabelBinarizer()
chronic_matrix = mlb_chronic.fit_transform(df["chronic_diseases"])
meds_matrix = mlb_meds.fit_transform(df["medications"])

mlp_features = np.concatenate([df[numeric_cols].values, gender, chronic_matrix, meds_matrix], axis=1)

# ✅ coarse 라벨 인코딩
df["coarse_encoded"] = LabelEncoder().fit_transform(df["coarse_label"])
y_coarse = tf.keras.utils.to_categorical(df["coarse_encoded"])

# ✅ coarse 모델 학습 (필요시 추가)
# (생략 가능: focus는 fine 구조 통합에 있음)

# ✅ fine 모델 학습 루프
fine_models = {}
for group_name, fine_list in coarse_map.items():
    print(f"\n📌 Fine 모델 학습: {group_name}")
    sub_df = df[df["coarse_label"] == group_name].copy()
    le_fine = LabelEncoder()
    sub_df["fine_encoded"] = le_fine.fit_transform(sub_df["disease_name"])
    y_fine = tf.keras.utils.to_categorical(sub_df["fine_encoded"])

    idx = sub_df.index
    X_mlp = mlp_features[idx]
    X_text = tf.gather(text_features, idx).numpy()

    X_train_mlp, X_val_mlp, X_train_text, X_val_text, y_train, y_val = train_test_split(
        X_mlp, X_text, y_fine, test_size=0.15,
        stratify=np.argmax(y_fine, axis=1), random_state=42
    )

    model = build_fine_model(
        mlp_dim=X_train_mlp.shape[1],
        text_dim=X_train_text.shape[1],
        output_dim=y_fine.shape[1]
    )

    model.fit(
        [X_train_mlp, X_train_text], y_train,
        validation_data=([X_val_mlp, X_val_text], y_val),
        epochs=30, batch_size=64,
        callbacks=[EarlyStopping(patience=5, restore_best_weights=True)],
        verbose=1
    )

    fine_models[group_name] = model
    print("✅ 저장 완료")

# ✅ 모델 저장
for group, model in fine_models.items():
    model.save(f"model_fine_{group}.h5")

# ✅ 인코더 저장
joblib.dump(scaler, "scaler.pkl")
joblib.dump(mlb_chronic, "mlb_chronic.pkl")
joblib.dump(mlb_meds, "mlb_meds.pkl")
