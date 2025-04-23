export interface PredictRequest {
  symptoms: string[];
}

export interface PredictResponse {
  diagnosis: string;
  confidence: number;
} 