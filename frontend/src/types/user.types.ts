// 📄 src/types/user.types.ts
// 사용자 모델의 타입 정의
// - 백엔드 `/auth/me`, `/users/:id` 응답 구조 기준

export type User = {
    id: string;
    email: string;
    name?: string;

    // 🔸 필수 건강 정보
    gender?: "남성" | "여성";
    age?: number;
    height?: number;
    weight?: number;
    bmi?: number;

    // 🔸 연결된 지병 및 약물 (서버 평탄화 구조 기준)
    medications?: { id: string; name: string }[];
    diseases?: { id: string; name: string }[];

    // 🔸 권한 및 메타 정보
    role?: "user" | "admin";
    createdAt?: string;
    updatedAt?: string;
};

export type UserProfileResponse = {
    id: string;
    email: string;
    name: string;
    gender: "남성" | "여성";
    age: number;
    height: number;
    weight: number;
    bmi: number; // ✅ 이 줄 꼭 필요!
    role: "user" | "admin";
    diseases: { sickCode: string; name: string }[];
    medications: { id: string; name: string }[];
};
