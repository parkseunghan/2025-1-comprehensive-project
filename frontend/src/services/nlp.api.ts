// 📄 src/services/nlp.api.ts
import axios from './axios';
import { LLMExtractKeyword } from '@/types/symptom.types';

export const extractSymptomsWithNLP = async (
  text: string
): Promise<LLMExtractKeyword[]> => {
  const res = await axios.post("/nlp/extract", { symptomText: text });
  return res.data.keywords;
};
