// 📄 src/services/medication.api.ts
import axios from "./axios";

/**
 * 전체 약물 목록을 불러옵니다
 * @returns string[] 형태의 약물 이름 목록
 */
export const fetchAllMedications = async (): Promise<string[]> => {
  const res = await axios.get("/medications");
  return res.data.map((item: { name: string }) => item.name); // 백엔드에서 [{name}] 반환
};
