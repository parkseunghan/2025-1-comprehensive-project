# train_coarse_model.py
"""
📦 coarse 질병 분류 모델 학습 스크립트
- 증상 임베딩(npy) + 수치/범주형 피처(MultiLabel) 기반
- coarse 레벨 (감기, 감염, 소화기, 호흡기, 심혈관)
"""

import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, MultiLabelBinarizer
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix

from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Concatenate, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.losses import CategoricalCrossentropy
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# ✅ 데이터 로드
CSV_PATH = "./data/raw/leaned_train_dataset.csv"
SBERT_PATH = "./data/processed/leaned_sbert_text_features_final.npy"

print("📄 데이터 로딩 중...")
df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
sbert_text_features = np.load(SBERT_PATH)[:len(df)]

# ✅ 전처리
coarse_map = {
    "감기": ["급성 기관지염", "급성 비인두염", "급성 인두염", "상기도 감염"],
    "감염": ["급성 장염", "간염", "요로감염"],
    "소화기": ["위염", "위식도역류질환(GERD)", "소화성 궤양", "췌장염", "과민성 대장증후군"],
    "호흡기": ["폐렴", "천식", "만성 폐쇄성 폐질환(COPD)"],
    "심혈관": ["심부전", "협심증", "빈혈"]
}

# coarse 라벨 생성
def map_coarse(name):
    for k, v in coarse_map.items():
        if name in v:
            return k
    return None

df["disease_name"] = df["disease_name"].apply(lambda x: x[0] if isinstance(x, list) else x)
df["coarse_label"] = df["disease_name"].apply(map_coarse)
df.dropna(subset=["coarse_label"], inplace=True)
df.reset_index(drop=True, inplace=True)

# 수치 정규화
scaler = StandardScaler()
numeric_cols = ["Age", "Height_cm", "Weight_kg", "BMI"]
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

# 범주형 인코딩
gender = df["Gender"].map({"남성": 1, "여성": 0}).fillna(0).values.reshape(-1, 1)
df["chronic_diseases"] = df["chronic_diseases"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
df["medications"] = df["medications"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
mlb_chronic = MultiLabelBinarizer()
mlb_meds = MultiLabelBinarizer()
chronic_matrix = mlb_chronic.fit_transform(df["chronic_diseases"])
meds_matrix = mlb_meds.fit_transform(df["medications"])

# 최종 MLP 피처
mlp_features = np.concatenate([
    df[numeric_cols].values,
    gender,
    chronic_matrix,
    meds_matrix
], axis=1)
text_features = sbert_text_features.astype(np.float32)

# coarse 라벨 인코딩
y_label_encoder = LabelEncoder()
df["coarse_encoded"] = y_label_encoder.fit_transform(df["coarse_label"])
y = to_categorical(df["coarse_encoded"])

# 데이터 분할
X_mlp = mlp_features
X_text = text_features
X_train_val_mlp, X_test_mlp, X_train_val_text, X_test_text, y_train_val, y_test = train_test_split(
    X_mlp, X_text, y,
    test_size=0.15,
    stratify=df["coarse_encoded"],
    random_state=42
)
X_train_mlp, X_val_mlp, X_train_text, X_val_text, y_train, y_val = train_test_split(
    X_train_val_mlp, X_train_val_text, y_train_val,
    test_size=0.1765,
    stratify=np.argmax(y_train_val, axis=1),
    random_state=42
)

# class weight
class_weights = compute_class_weight(class_weight='balanced', classes=np.unique(df["coarse_encoded"]), y=df["coarse_encoded"])
class_weights_dict = {i: w for i, w in enumerate(class_weights)}

# coarse 모델 정의 및 학습
print("🧠 coarse 모델 학습 중...")
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

model_coarse = build_model_coarse(
    mlp_dim=X_train_mlp.shape[1],
    text_dim=X_train_text.shape[1],
    output_dim=y.shape[1]
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

# 평가
print("\n📊 coarse 테스트셋 성능")
y_pred_proba = model_coarse.predict([X_test_mlp, X_test_text])
y_pred = np.argmax(y_pred_proba, axis=1)
y_true = np.argmax(y_test, axis=1)
print(classification_report(y_true, y_pred, target_names=y_label_encoder.classes_))

# 저장
print("💾 coarse 모델 저장 중...")
model_coarse.save("./models/model_coarse.h5")
print("✅ coarse 모델 저장 완료")


joblib.dump(y_label_encoder, "models/coarse_label_encoder.pkl")
joblib.dump(scaler, "models/scaler.pkl")
joblib.dump(mlb_chronic, "models/mlb_chronic.pkl")
joblib.dump(mlb_meds, "models/mlb_meds.pkl")
