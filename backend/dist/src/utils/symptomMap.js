"use strict";
// 🔹 symptomMap.ts
// mistral이 추출한 다양한 증상 표현을 통일된 증상 키워드로 매핑합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptomNormalizationMap = void 0;
exports.symptomNormalizationMap = {
    // 🧠 일반 증상
    "headache": "headache",
    "cough": "cough",
    "severe cough": "cough",
    // 🧴 피부 가려움 계열
    "itchy": "itching",
    "itching": "itching",
    "itchy skin": "itching",
    "skin itch": "itching",
    "skin itchy": "itching",
    "itchiness": "itching",
    "skin itchiness": "itching",
    "skin irritation": "itching",
    // 🌵 피부 건조 계열
    "dry skin": "dryness",
    "dryness": "dryness",
    "skin dryness": "dryness",
    // 🌡 피부 발적/붉어짐 계열
    "redness": "skin redness",
    "red skin": "skin redness",
    "flushed skin": "skin redness",
    // 💢 붓기
    "swollen": "swelling",
    "swelling": "swelling",
    "feel swollen": "swelling",
    "feels swollen": "swelling",
    // 😵‍ 어지러움/실신 느낌 계열
    "feeling faint": "dizziness",
    "faint": "dizziness",
    "feel flushed": "dizziness",
    "feeling dizzy": "dizziness",
    "dizzy": "dizziness",
    "feeling lightheaded": "dizziness",
    "feel sensitive to light": "photosensitivity",
    "feeling sensitive to light": "photosensitivity",
    "feeling blurry": "blurred vision",
    "feel blurred": "blurred vision",
    "sensitive to light": "photosensitivity",
    "feel tender": "skin sensitivity",
    "sensitive skin": "skin sensitivity",
    "skin sensitive": "skin sensitivity",
    "skin sensitivity": "skin sensitivity",
    "feel sensitive": "skin sensitivity",
    "feels sensitive": "skin sensitivity",
    // 피부 조임 느낌
    "tightness": "skin tightness",
    "feel tightness": "skin tightness",
    "tight skin": "skin tightness",
    "feels tight": "skin tightness",
    "feel tight": "skin tightness",
    "sore throat": "sore throat",
};
