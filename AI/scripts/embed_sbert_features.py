# embed_sbert_features.py
"""
💡 SBERT 임베딩 전용 스크립트
입력 데이터셋에서 symptom_keywords를 SBERT 임베딩하여
numpy 파일(.npy)로 저장하는 전처리 스크립트입니다.
"""

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# ✅ 경로 설정
INPUT_PATH = "./data/raw/leaned_train_dataset.csv"
OUTPUT_PATH = "./data/processed/leaned_sbert_text_features_final.npy"
MODEL_NAME = "snunlp/KR-SBERT-V40K-klueNLI-augSTS"

# ✅ 데이터 로딩 및 전처리
print("📦 데이터 로딩 중...")
df = pd.read_csv(INPUT_PATH, encoding="utf-8-sig")
df["symptom_keywords_cleaned"] = df["symptom_keywords"].apply(
    lambda x: x.replace(",", " ") if isinstance(x, str) else ""
)
texts = df["symptom_keywords_cleaned"].tolist()
assert len(texts) == len(df), "❌ 텍스트 수와 df 길이가 불일치합니다."

# ✅ SBERT 모델 로딩
print("🧠 SBERT 모델 로딩 중...")
model = SentenceTransformer(MODEL_NAME)

# ✅ 임베딩 수행
print("🔄 임베딩 수행 중...")
embeddings = model.encode(
    texts,
    convert_to_tensor=False,
    batch_size=64,
    show_progress_bar=True
)

# ✅ 저장
print(f"💾 임베딩 결과 저장: {OUTPUT_PATH}")
np.save(OUTPUT_PATH, embeddings)
print("✅ 완료!", embeddings.shape)