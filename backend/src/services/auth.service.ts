// 🔹 auth.service.ts
// 이 파일은 인증 로직을 처리하는 서비스 계층입니다.
// 더미 사용자 배열을 기반으로 회원가입 및 로그인 로직을 구현합니다.

import { users } from "../mock/users";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../utils/jwt.util";

/**
 * 회원가입 요청 처리
 */
export const register = (data: { email: string; password: string; name?: string }) => {
    const exists = users.find((u) => u.email === data.email);
    if (exists) {
        return { message: "이미 등록된 이메일입니다." };
    }

    const newUser = {
        id: uuidv4(),
        email: data.email,
        password: data.password,
        name: data.name ?? "",
        gender: "",
        age: 0,
        height: 0,
        weight: 0,
        medications: [],
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
};

/**
 * 로그인 요청 처리
 */
export const login = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return null;

    const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
    })

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};
