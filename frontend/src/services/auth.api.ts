// auth.api.ts
// 인증 관련 API 요청 코드 (로그인, 회원가입, 내 정보 조회)

import axios from "./axios";

// 🔐 로그인 요청
export const login = async (email: string, password: string) => {
    const res = await axios.post("/auth/login", { email, password });
    return res.data; // { token, user }
};

// 👤 로그인된 사용자 정보 조회 (JWT 필요)
export const fetchMe = async () => {
    const res = await axios.get("/auth/me");
    return res.data; // User
};

// 📝 회원가입 요청
export const register = async (
    email: string,
    password: string,
    name?: string
) => {
    const res = await axios.post("/auth/register", {
        email,
        password,
        name,
    });
    return res.data;
};
