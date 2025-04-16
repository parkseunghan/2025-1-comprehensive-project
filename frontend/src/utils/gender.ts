/**
 * 🔹 성별: DB에서 '남성' 또는 '여성'으로 저장되어 있는 값을 그대로 사용합니다.
 * - 이 함수는 존재하지 않는 값이 들어올 경우 fallback을 반환합니다.
 * - 현재 백엔드에는 '남성', '여성'만 저장됨
 */

/**
 * 한글 성별 문자열을 그대로 반환 (예외 시 "기타"로 fallback)
 */
export const toKoreanGender = (value?: string | null): string => {
    if (value === "남성" || value === "여성") return value;
    return "기타";
  };
  
  /**
   * 한글 성별 값을 영어로 매핑 (예: 프론트 폼 제출 시 변환용)
   */
  export const toEnglishGender = (value?: string | null): string => {
    if (value === "남성") return "male";
    if (value === "여성") return "female";
    return "other";
  };
  