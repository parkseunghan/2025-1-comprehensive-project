// 🔹 auth.service.ts
// 이 파일은 인증 로직을 처리하는 서비스 계층입니다.
// DB 저장/조회 + 최소 사용자 정보 리턴 (비밀번호 제외)

import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../utils/jwt.util";
import prisma from "../config/prisma.service";

/**
 * 회원가입 요청 처리
 * 이메일 중복 여부 확인 후 사용자 생성
 */
export const signup = async (data: {
    email: string;
    password: string;
    name?: string;
}): Promise<
    | {
        id: string;
        email: string;
        name?: string; // ✅ Optional: Prisma에 맞춤
    }
    | { message: string }
> => {
    const exists = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (exists) {
        return { message: "이미 등록된 이메일입니다." };
    }

    const newUser = await prisma.user.create({
        data: {
            id: uuidv4(),
            email: data.email,
            password: data.password,
            name: data.name ?? "", // ✅ 기본값 제공
            gender: "",
            age: 0,
            height: 0,
            weight: 0,
            medications: [],
        },
    });

    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name ?? undefined
    };
};

/**
 * 로그인 요청 처리
 * 이메일과 비밀번호 확인 후 토큰 발급
 */
export const login = async (
    email: string,
    password: string
): Promise<null | { token: string; user: { id: string; email: string; name?: string } }> => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || user.password !== password) return null;

    const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name ?? "", // ✅ 토큰에도 기본값
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
        },
    };
};

/**
 * 사용자 ID로 사용자 정보 조회
 * 비밀번호를 제외한 사용자 객체 반환
 */
export const getUserById = async (
    id: string
): Promise<{
    id: string;
    email: string;
    name?: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    medications: string[];
    createdAt: Date;
    updatedAt: Date;
} | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) return null;

    const { password, ...safeUser } = user;
    return {
        ...safeUser,
        name: user.name ?? undefined, // ✅ 명시적 처리 필요
    };
};
