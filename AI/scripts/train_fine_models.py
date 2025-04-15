# train_fine_models.py
"""
📦 coarse 그룹별 fine 질병 분류 모델 학습 스크립트
- coarse 그룹: 감기, 감염, 소화기, 호흡기, 심혈관
- fine_config.json 기반으로 개별 모델 설정 및 학습 진행
"""

import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, MultiLabelBinarizer
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report

from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Concatenate
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical
from focal_loss import SparseCategoricalFocalLoss
import joblib
import os

# ✅ 경로 설정
CSV_PATH = "./data/raw/leaned_train_dataset.csv"
SBERT_PATH = "./data/processed/leaned_sbert_text_features_final.npy"
CONFIG_PATH = "./data/fine_config.json"
SAVE_DIR = "./models/fine"
os.makedirs(SAVE_DIR, exist_ok=True)

# ✅ 한글 그룹명을 영문 파일명으로 매핑
GROUP_NAME_MAP = {
    "감기": "cold",
    "감염": "infection",
    "소화기": "digestive",
    "호흡기": "respiratory",
    "심혈관": "cardio"
}

# ✅ 데이터 로딩 및 전처리
df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
df["disease_name"] = df["disease_name"].apply(lambda x: x[0] if isinstance(x, list) else x)
sbert_features = np.load(SBERT_PATH)[:len(df)]

# coarse 라벨
coarse_map = {
    "감기": ["급성 기관지염", "급성 비인두염", "급성 인두염", "상기도 감염"],
    "감염": ["급성 장염", "간염", "요로감염"],
    "소화기": ["위염", "위식도역류질환(GERD)", "소화성 궤양", "췌장염", "과민성 대장증후군"],
    "호흡기": ["폐렴", "천식", "만성 폐쇄성 폐질환(COPD)"],
    "심혈관": ["심부전", "협심증", "빈혈"]
}

def map_coarse(name):
    for k, v in coarse_map.items():
        if name in v:
            return k
    return None

df["coarse_label"] = df["disease_name"].apply(map_coarse)
df.dropna(subset=["coarse_label"], inplace=True)
df.reset_index(drop=True, inplace=True)

# 수치 + 범주형 전처리
numeric_cols = ["Age", "Height_cm", "Weight_kg", "BMI"]
df[numeric_cols] = StandardScaler().fit_transform(df[numeric_cols])
df["chronic_diseases"] = df["chronic_diseases"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
df["medications"] = df["medications"].apply(lambda x: x.split(',') if isinstance(x, str) and x != "없음" else [])
gender = df["Gender"].map({"남성": 1, "여성": 0}).fillna(0).values.reshape(-1, 1)
mlb_chronic = MultiLabelBinarizer()
mlb_meds = MultiLabelBinarizer()
X_mlp = np.concatenate([
    df[numeric_cols].values,
    gender,
    mlb_chronic.fit_transform(df["chronic_diseases"]),
    mlb_meds.fit_transform(df["medications"])
], axis=1)
X_text = sbert_features.astype(np.float32)

# config 로딩
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    fine_config = json.load(f)

loss_map = {
    "categorical_crossentropy": "categorical_crossentropy",
    "focal": SparseCategoricalFocalLoss(gamma=2.0)
}

# 🔁 coarse 그룹별 반복 학습
fine_label_encoders = {}

for group in fine_config:
    config = fine_config[group]
    df_sub = df[df["coarse_label"] == group].copy()
    df_sub["fine_label"] = df_sub["disease_name"]

    label_encoder = LabelEncoder()
    df_sub["fine_encoded"] = label_encoder.fit_transform(df_sub["fine_label"])
    fine_label_encoders[group] = label_encoder

    y = to_categorical(df_sub["fine_encoded"]) if config["output_type"] == "onehot" else df_sub["fine_encoded"].values
    idx = df_sub.index
    X_mlp_group = X_mlp[idx]
    X_text_group = X_text[idx]

    X_train_mlp, X_val_mlp, X_train_text, X_val_text, y_train, y_val = train_test_split(
        X_mlp_group, X_text_group, y,
        test_size=0.15,
        stratify=df_sub["fine_encoded"],
        random_state=42
    )

    mlp_input = Input(shape=(X_train_mlp.shape[1],))
    x1 = Dense(64, activation='relu')(mlp_input)
    x1 = Dropout(0.2)(x1)

    text_input = Input(shape=(X_train_text.shape[1],))
    x2 = Dense(128, activation='relu')(text_input)
    x2 = Dropout(0.3)(x2)

    x = Concatenate()([x1, x2])
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    output = Dense(y.shape[1] if config["output_type"] == "onehot" else len(label_encoder.classes_), activation='softmax')(x)

    model = Model(inputs=[mlp_input, text_input], outputs=output)
    model.compile(
        optimizer=Adam(0.0005),
        loss=loss_map[config["loss"]],
        metrics=["accuracy"]
    )

    model.fit(
        [X_train_mlp, X_train_text], y_train,
        validation_data=([X_val_mlp, X_val_text], y_val),
        epochs=30,
        batch_size=64,
        callbacks=[EarlyStopping(patience=5, restore_best_weights=True)],
        verbose=1
    )

    y_pred = np.argmax(model.predict([X_val_mlp, X_val_text]), axis=1)
    y_true = np.argmax(y_val, axis=1) if config["output_type"] == "onehot" else y_val

    print(f"\n📊 {group} 그룹 fine 분류 결과:")
    print(classification_report(y_true, y_pred, target_names=label_encoder.classes_))

    file_key = GROUP_NAME_MAP[group]  # ✅ 영문 이름 사용
    model.save(f"{SAVE_DIR}/model_fine_{file_key}.h5")
    print(f"✅ 모델 저장 완료: model_fine_{file_key}.h5")

print("\n💾 fine 인코더 저장 중...")
for group, encoder in fine_label_encoders.items():
    file_key = GROUP_NAME_MAP[group]
    joblib.dump(encoder, f"{SAVE_DIR}/fine_label_encoder_{file_key}.pkl")
    print(f"✅ {group} → 저장 완료: fine_label_encoder_{file_key}.pkl")
