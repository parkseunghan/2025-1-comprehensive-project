# save_artifacts.py
"""
🧾 모델 부속 객체 저장 스크립트
- coarse 라벨 인코더
- fine 라벨 인코더들
- 전처리기: scaler, mlb_chronic, mlb_meds
"""

import joblib
import os

# ✅ 디렉토리 설정
SAVE_DIR = "../models"
FINE_DIR = os.path.join(SAVE_DIR, "fine")
os.makedirs(FINE_DIR, exist_ok=True)

# 🔸 사전에 생성된 객체가 아래 변수에 있다고 가정
# coarse_le: coarse 라벨 인코더 (LabelEncoder)
# fine_label_encoders: dict {"감기": LabelEncoder(), ...}
# scaler: StandardScaler()
# mlb_chronic: MultiLabelBinarizer()
# mlb_meds: MultiLabelBinarizer()

# ✅ coarse 라벨 인코더 저장
joblib.dump(coarse_le, os.path.join(SAVE_DIR, "coarse_label_encoder.pkl"))
print("✅ coarse_label_encoder 저장 완료")

# ✅ fine 라벨 인코더 저장
for group, encoder in fine_label_encoders.items():
    path = os.path.join(FINE_DIR, f"fine_label_encoder_{group}.pkl")
    joblib.dump(encoder, path)
    print(f"✅ {group} 인코더 저장 완료 → {path}")

# ✅ 전처리기 저장
joblib.dump(scaler, os.path.join(SAVE_DIR, "scaler.pkl"))
joblib.dump(mlb_chronic, os.path.join(SAVE_DIR, "mlb_chronic.pkl"))
joblib.dump(mlb_meds, os.path.join(SAVE_DIR, "mlb_meds.pkl"))
print("✅ 전처리기 저장 완료")
