from typing import List, Dict, Optional
from utils.symptom_mapping import SYMPTOM_MAPPING
from utils.text_cleaner import clean_and_tokenize

TIME_KEYWORDS = {
    "ko": {
        "아침": "morning",
        "오전": "morning",
        "점심": "afternoon",
        "오후": "afternoon",
        "저녁": "evening",
        "밤": "night",
    },
    "en": {
        "morning": "morning",
        "afternoon": "afternoon",
        "evening": "evening",
        "night": "night",
    },
}


def extract_combined_symptoms(text_ko: str, text_en: str) -> List[Dict[str, str]]:
    print(f"\n🔵 [Step 1] 원문(ko): {text_ko}")
    print(f"🔵 [Step 2] 번역(en): {text_en}")

    results = []
    tokens_ko = clean_and_tokenize(text_ko)
    tokens_en = clean_and_tokenize(text_en.lower())

    print(f"\n🟡 [Step 3] Tokenized (ko): {tokens_ko}")
    print(f"🟡 [Step 4] Tokenized (en): {tokens_en}")

    # ✅ 정제 후 토큰 출력 추가
    print(f"\n🟡 [Step 4-1] 정제 후 토큰 (ko): {[t for t in tokens_ko]}")
    print(f"🟡 [Step 4-2] 정제 후 토큰 (en): {[t for t in tokens_en]}")

    for symptom, mapping in SYMPTOM_MAPPING.items():
        # 1️⃣ 한글 키워드 직접 매칭
        if any(keyword in text_ko for keyword in mapping["ko"]):
            print(f"✅ [KO match] '{symptom}' matched by keyword in: {mapping['ko']}")
            results.append({"symptom": symptom, "time": detect_time(text_ko, "ko")})
            continue

        # 2️⃣ 영어 키워드 직접 매칭
        if any(keyword in text_en for keyword in mapping["en"]):
            print(f"✅ [EN match] '{symptom}' matched by keyword in: {mapping['en']}")
            results.append({"symptom": symptom, "time": detect_time(text_en, "en")})
            continue

        # 3️⃣ 토큰 기반 조합식 매칭
        for token_set in mapping.get("token_sets", []):
            part1_match = [tok for tok in tokens_ko if tok in token_set["part1"]]
            part2_match = [tok for tok in tokens_ko if tok in token_set["part2"]]
            print(
                f"🔍 [DEBUG] {symptom} token_sets 검사 - part1: {part1_match}, part2: {part2_match}"
            )
            if part1_match and part2_match:
                print(
                    f"✅ [TokenSet match] '{symptom}' matched by part1: {part1_match}, part2: {part2_match}"
                )
                results.append({"symptom": symptom, "time": detect_time(text_ko, "ko")})
                break

    # 🔹 복합 증상 (e.g., 몸살) 분해 처리
    composite = handle_composite_symptoms(text_ko, results)
    if composite:
        print(
            f"✅ [Composite] Added symptoms from '몸살': {[s['symptom'] for s in composite]}"
        )
        results += composite

    final = deduplicate_results(results)
    print(f"\n🟢 [Step 5] 최종 추출 결과: {final}")
    return final


def detect_time(text: str, lang: str) -> Optional[str]:
    return next((v for k, v in TIME_KEYWORDS[lang].items() if k in text), None)


def deduplicate_results(results: List[Dict[str, str]]) -> List[Dict[str, str]]:
    seen = set()
    unique = []
    for item in results:
        key = (item["symptom"], item["time"])
        if key not in seen:
            seen.add(key)
            unique.append(item)
    return unique


def handle_composite_symptoms(
    text_ko: str, existing_results: List[Dict[str, str]]
) -> List[Dict[str, str]]:
    """
    '몸살'처럼 여러 증상으로 분해 가능한 복합 증상을 처리합니다.
    """
    composite_symptoms = []

    # 🔹 몸살 → 오한, 근육통, 피로, 미열
    if "몸살" in text_ko:
        mapped = ["오한", "근육통", "피로", "미열"]
        for symptom in mapped:
            if not any(r["symptom"] == symptom for r in existing_results):
                composite_symptoms.append(
                    {"symptom": symptom, "time": detect_time(text_ko, "ko")}
                )

    return composite_symptoms
