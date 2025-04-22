# 📄 scripts/extract_symptom_map.py
# disease_name별로 symptom_keywords를 그룹핑해서 symptomMap 생성

import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
csv_path = f"{BASE_DIR}/data/raw/leaned_train_dataset.csv"
output_path = f"{BASE_DIR}/data/processed/symptom_map.json"

# 1. CSV 로드
df = pd.read_csv(csv_path)

# 2. 결측값 제거 (안전)
df = df.dropna(subset=["disease_name", "symptom_keywords"])

# 3. symptom_keywords 파싱 함수
def parse_keywords(s):
    return [kw.strip() for kw in str(s).split(",")]

# 4. 그룹핑: 질병명 기준으로 키워드 병합
symptom_map = {}
for disease, group in df.groupby("disease_name"):
    keywords = []
    for sym_str in group["symptom_keywords"]:
        keywords.extend(parse_keywords(sym_str))
    # 중복 제거 후 저장
    symptom_map[disease] = sorted(list(set(keywords)))

# 5. JSON 저장
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(symptom_map, f, ensure_ascii=False, indent=2)

print(f"✅ symptom_map.json saved to: {output_path}")
