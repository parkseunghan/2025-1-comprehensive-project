// user.ts
// 백엔드 `/auth/me` 및 사용자 관련 API의 응답 타입 정의

export type User = {
    id: string;
    email: string;
    name?: string;
    gender?: string;
    age?: number;
    height?: number;
    weight?: number;
    medications?: string[];
  };
  