/**
 * user.api.ts
 * 사용자 관련 API 요청을 처리하는 모듈입니다.
 * 프로필 조회 및 업데이트 요청을 포함합니다.
 */

import axios from "./axios";
import { User } from "@/types/user.types";
import { userProfileSchema } from "@/schemas/user.schema";
import { Disease } from "@/types/disease.types";
import { Medication } from "@/types/medication.types";

export interface UserProfileResponse {
  bmi: any;
  role: any;
  id: string;
  email: string;
  name: string;
  gender: "남성" | "여성";
  age: number;
  height: number;
  weight: number;
  diseases: Disease[];         // ← 이 부분이 중요!
  medications: Medication[];
}


// 🔸 Zod 기반 사용자 프로필 입력 타입
export type UpdateUserInput = typeof userProfileSchema._type;

// 🔸 사용자 ID 포함 요청 페이로드 타입
export type UpdateUserPayload = {
  id: string;
} & UpdateUserInput;

/**
 * 🔹 updateUserProfile
 * 사용자 정보를 수정하는 PATCH 요청
 *
 * @param payload - 사용자 ID 및 업데이트할 프로필 데이터
 * @returns 수정된 사용자 객체
 */
export const updateUserProfile = async (
  payload: UpdateUserPayload
): Promise<User> => {
  const { id, ...data } = payload;
  const res = await axios.patch(`/users/${id}`, data);
  return res.data;
};

/**
 * 🔹 fetchCurrentUser
 * 특정 사용자 ID를 기반으로 프로필 전체 정보 조회
 *
 * @param userId - 사용자 ID
 * @returns 사용자 전체 프로필 (지병/약물 포함)
 */
export const fetchCurrentUser = async (userId: string): Promise<UserProfileResponse> => {
  const res = await axios.get(`/users/${userId}`);
  return res.data;
};