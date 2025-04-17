// 📄 src/types/prediction.ts
// 예측 API 요청 및 응답 타입 정의

/**
 * 🔹 PredictInput
 * @param recordId - 예측 대상이 되는 증상 기록 ID
 * @param symptoms - (선택적) 증상 및 시간 정보 배열
 */
export interface PredictInput {
    recordId: string;
    symptoms?: {
      symptom: string;
      time: string | null;
    }[];
  }
  
  /**
   * 🔹 PredictionResult
   * @property coarseLabel - 예측된 coarse 질병군 (ex: 감기, 내과)
   * @property riskScore - 위험도 점수 (수치)
   * @property riskLevel - 위험 수준 (낮음 / 보통 / 높음 / 응급)
   * @property guideline - 사용자 행동 가이드라인
   * @property top1~top3 - 상위 예측 질병명 및 확률
   * @property elapsedSec - 예측 소요 시간 (선택)
   */
  export interface PredictionResult {
    coarseLabel: string;
    riskScore: number;
    riskLevel: string;
    guideline: string;
  
    top1?: string;
    top1Prob?: number;
    top2?: string;
    top2Prob?: number;
    top3?: string;
    top3Prob?: number;
  
    elapsedSec?: number;
  }
  