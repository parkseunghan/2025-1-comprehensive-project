// 📄 src/types/prediction.types.ts

export type PredictRequest = {
  gender: string;
  age: number;
  height: number;
  weight: number;
  chronic_diseases: string[];
  medications: string[];
  symptom_keywords: string[];
};

export type PredictResponse = {
  predictions: {
    coarseLabel: string;
    fineLabel: string | null;
    riskScore: number;
  }[];
};



export interface PredictionCandidate {
  coarseLabel: string;
  fineLabel: string;
  riskScore: number;
  riskLevel: string;
  guideline: string;
}

