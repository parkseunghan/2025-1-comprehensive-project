// 📄 src/services/medication.api.ts
import axios from "./axios";
import { Medication } from "@/types/medication.types";

/**
 * 전체 약물 목록을 불러옵니다
 */

export const fetchAllMedications = async (): Promise<Medication[]> => {
    const res = await axios.get("/medications");
    return res.data; // ✅ 객체 전체 반환
};
