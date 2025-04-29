// 📄 src/types/prediction.ts

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
  