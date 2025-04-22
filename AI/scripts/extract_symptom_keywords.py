# 📄 scripts/extract_symptom_keywords.py
"""
💡 증상 키워드 추출 스크립트
CSV 파일에서 symptom_keywords 열을 추출하여
JSON 파일로 저장하는 스크립트.
"""


import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
csv_path = f"{BASE_DIR}/data/raw/leaned_train_dataset.csv"
output_path = f"{BASE_DIR}/data/processed/symptom_keywords_list.json"

# 🔹 CSV 파일 로드
df = pd.read_csv(csv_path)

# 🔹 쉼표 기준으로 나눔 + 양쪽 공백 제거
symptom_keywords_list = df['symptom_keywords'].apply(
    lambda x: [kw.strip() for kw in str(x).split(",")]
).tolist()

# 🔹 JSON 저장
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(symptom_keywords_list, f, ensure_ascii=False, indent=2)

print(f"✅ symptom_keywords_list saved to: {output_path}")
