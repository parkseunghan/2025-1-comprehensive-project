// 📄 services/auth.service.ts
// 인증 로직 처리 (회원가입, 로그인, 사용자 조회)

import prisma from "../config/prisma.service";
import bcrypt from "bcryptjs";
import { generateToken, JwtPayload } from "../utils/jwt.util";

/**
 * 🔹 회원가입
 */
export const signup = async ({ email, password, name }: {
    email: string;
    password: string;
    name?: string;
}): Promise<JwtPayload | { message: string }> => {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { message: "이미 등록된 이메일입니다." };

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name: name ?? "",
            gender: "",
            age: 0,
            height: 0,
            weight: 0,
            bmi: 0,
        },
    });

    return { id: user.id, email: user.email, name: user.name ?? undefined };
};

/**
 * 🔹 로그인
 */
export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return null;

    const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        gender: user.gender,
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            gender: user.gender,
        },
    };
};

/**
 * 🔹 사용자 조회 (GET /auth/me)
 */
export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            medications: { include: { medication: true } },
            diseases: { include: { disease: true } },
        },
    });

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        medications: user.medications.map((m) => ({
            id: m.medication.id,
            name: m.medication.name,
        })),
        diseases: user.diseases.map((d) => ({
            id: d.disease.sickCode,
            name: d.disease.name,
        })),
    };
};

/**
 * 🔹 비밀번호 변경
 */
export const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, message: "사용자를 찾을 수 없습니다.", status: 404 };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return { success: false, message: "현재 비밀번호가 일치하지 않습니다.", status: 401 };

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return { success: true, message: "비밀번호 변경 완료" };
};