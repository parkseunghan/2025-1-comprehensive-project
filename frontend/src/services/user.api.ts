/**
 * user.api.ts
 * 이 파일은 사용자 관련 API 요청을 처리하는 모듈입니다.
 * 사용자 프로필 정보 조회 및 수정을 포함합니다.
 */

import axios from "./axios";

// 🔸 사용자 프로필 수정 시 사용될 입력 타입
export type UpdateUserInput = {
  gender: string;
  age: number;
  height: number;
  weight: number;
  medications?: string[];
  diseases?: string[];
};

// 🔸 사용자 ID를 포함한 요청 타입
export type UpdateUserPayload = {
  id: string;
} & UpdateUserInput;

/**
 * 🔹 updateUserProfile
 * @param payload - 사용자 ID + 업데이트할 프로필 정보
 * @returns 업데이트된 사용자 객체
 *
 * 해당 함수는 백엔드 `/users/:id` PATCH API를 호출하여
 * 사용자 정보를 수정하고, 수정된 데이터를 반환받습니다.
 */
export const updateUserProfile = async (payload: UpdateUserPayload) => {
  const { id, ...data } = payload;
  const res = await axios.patch(`/users/${id}`, data);
  return res.data;
};

/**
 * 🔹 fetchCurrentUser
 * @param userId - 조회할 사용자 ID
 * @returns 전체 사용자 프로필 정보 (지병 + 약물 포함)
 *
 * 해당 함수는 백엔드 `/users/:id` GET API를 호출하여
 * 사용자의 전체 정보를 조회합니다.
 */
export const fetchCurrentUser = async (userId: string) => {
  const { data } = await axios.get(`/users/${userId}`);
  return data;
};
