"use strict";
// 📄 translate.util.ts
// 사용자의 한글 문장을 영어로 번역하는 함수 (임시 더미 구현)
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToEnglish = void 0;
const translateToEnglish = (texts) => {
    // 실제 구현은 API 연동 or 번역 라이브러리 사용
    return texts
        .map((t) => {
        if (t.includes("기침"))
            return "I have a cough.";
        if (t.includes("머리"))
            return "I have a headache.";
        if (t.includes("가렵"))
            return "I have itching.";
        if (t.includes("따가"))
            return "My skin stings.";
        return "I feel unwell.";
    })
        .join(" ");
};
exports.translateToEnglish = translateToEnglish;
