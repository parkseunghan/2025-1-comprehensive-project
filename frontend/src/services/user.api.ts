/**
 * user.api.ts
 * 이 파일은 사용자 관련 API 요청을 처리하는 모듈입니다.
 * 사용자 프로필 정보를 수정하는 PATCH 요청을 제공합니다.
 */

import axios from "./axios";

// 🔸 [타입 정의]
// 사용자 프로필 수정에 필요한 입력 타입
export type UpdateUserInput = {
  gender: string;
  age: number;
  height: number;
  weight: number;
  medications?: string[];
  diseases?: string[];
};

// 🔸 [요청 페이로드 타입]
export type UpdateUserPayload = {
  id: string;
} & UpdateUserInput;

/**
 * 🔹 updateUserProfile
 * @param payload - 사용자 ID + 업데이트할 프로필 정보
 * @returns 업데이트된 사용자 객체
 *
 * 해당 함수는 백엔드 `/users/:id` PATCH API를 호출하여
 * 사용자 프로필을 수정하고, 수정된 유저 정보를 반환받습니다.
 */
export const updateUserProfile = async (payload: UpdateUserPayload) => {
  const { id, ...data } = payload;
  const res = await axios.patch(`/users/${id}`, data);
  return res.data;
};
