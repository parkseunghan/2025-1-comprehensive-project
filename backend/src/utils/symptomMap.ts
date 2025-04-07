// 🔹 symptomMap.ts
// mistral이 추출한 다양한 증상 표현을 통일된 키워드로 매핑합니다.

export const symptomNormalizationMap: Record<string, string> = {
    // 공통 증상
    "headache": "headache",
    "cough": "cough",
  
    // 피부 관련
    "itchy skin": "itching",
    "skin itchiness": "itching",
    "itchiness": "itching",
    "itching": "itching",
  
    "dry skin": "dryness",
    "dryness": "dryness",
  
    "redness": "skin redness",
    "red skin": "skin redness",
    "flushed skin": "skin redness",
  
    "swelling": "swelling",
  
    // 기타 가능성
    "skin dryness": "dryness",
    "skin irritation": "itching",
  };
  