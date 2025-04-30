// src/utils/risk-utils.ts

export const calculateRiskLevel = (riskScore: number): string => {
  if (riskScore >= 0.8) return "응급 🚑";
  if (riskScore >= 0.6) return "높음 ⚠️";
  if (riskScore >= 0.4) return "보통 👀";
  return "낮음 🙂";
};

export const generateGuideline = (riskLevel: string): string => {
  if (riskLevel.includes("응급")) return "즉시 응급실 방문이 필요합니다.";
  if (riskLevel.includes("높음")) return "가까운 병원 방문을 권장합니다.";
  if (riskLevel.includes("보통")) return "증상을 경과 관찰하고 심화 시 병원에 방문하세요.";
  return "생활 관리를 통해 주의하세요.";
};
