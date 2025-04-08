// 🔹 auth.controller.ts
// 이 파일은 인증(Authentication) 관련 요청을 처리하는 컨트롤러입니다.
// 회원가입, 로그인, 사용자 정보 조회 기능을 제공합니다.

import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { generateToken } from "../utils/jwt.util";

/**
 * 사용자 회원가입 요청 처리
 * POST /auth/register
 */
export const signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const result = await authService.signup({ email, password, name });

    // 이메일 중복 시
    if ("message" in result) {
        res.status(400).json({ message: result.message });
        return;
    }

    // ✅ 토큰 발급 및 응답
    const token = generateToken({
        id: result.id,
        email: result.email,
        name: result.name,
    });

    res.status(201).json({
        token,
        user: {
            id: result.id,
            email: result.email,
            name: result.name,
        },
    });
    return;
};

/**
 * 사용자 로그인 요청 처리
 * POST /auth/login
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result) {
        res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        return;
    }

    res.json(result); // 이미 { token, user } 구조
    return;
};

/**
 * 로그인된 사용자 정보 조회
 * GET /auth/me
 */
export const getMe = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "인증 정보가 없습니다." });
        return;
    }

    const user = await authService.getUserById(userId);

    if (!user) {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        return;
    }

    res.json(user);
    return
};
