export interface NlpExtractKeyword {
    symptom: string;
    time: string | null;
  }
  
  export interface NlpExtractResponse {
    original: string;
    cleaned: string;
    translated: string;
    results: NlpExtractKeyword[];
  }
  