// 🔹 user.controller.ts
// 사용자 API 요청을 처리하는 Express 컨트롤러입니다.

import { Request, Response } from "express";
import * as userService from "../services/user.services";
import { userUpdateSchema } from "../schemas/user.schema";
import { ZodError } from "zod";
import * as recordService from "../services/record.service";
import prisma from "../config/prisma.service";  // ✅ default import

/**
 * 🔹 POST /users/:userId/symptom-records
 * 사용자의 증상 기록 생성
 */
export const createSymptomRecord = async (req: Request, res: Response) => {
    try {
        const { symptomIds } = req.body;  // ✅ 수정됨

        if (!Array.isArray(symptomIds) || symptomIds.length === 0) {
            res.status(400).json({ message: "증상 ID 배열이 필요합니다." });
            return;
        }

        const symptomRecords = await prisma.symptom.findMany({
            where: {
                id: { in: symptomIds },
            },
            select: { id: true },
        });

        const record = await recordService.create(req.params.userId, symptomRecords.map(s => s.id));

        res.status(201).json(record);
    } catch (err) {
        console.error("❌ 증상 기록 생성 오류:", err);
        res.status(500).json({ message: "증상 기록 생성 중 서버 오류가 발생했습니다." });
    }
};


/**
 * 🔹 GET /users/:id
 * 사용자 ID로 전체 프로필 정보 조회
 */
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.findById(req.params.id);

        if (!user) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }

        res.json(user);
    } catch (err) {
        console.error("❌ 사용자 조회 오류:", err);
        res.status(500).json({ message: "사용자 조회 중 서버 오류가 발생했습니다." });
    }
};

/**
 * 🔹 PATCH /users/:id
 * 사용자 정보 수정
 */
export const updateUser = async (req: Request, res: Response) => {
    try {
        const parsed = userUpdateSchema.parse(req.body);

        const updated = await userService.update(req.params.id, parsed);

        res.json(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({
                message: "입력값이 유효하지 않습니다.",
                errors: err.flatten(),
            });
            return;
        }

        console.error("❌ 사용자 업데이트 오류:", err);
        res.status(500).json({ message: "사용자 정보를 수정하는 중 서버 오류가 발생했습니다." });
    }
};

/**
 * 🔹 DELETE /users/:id
 * 사용자 삭제
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await userService.remove(req.params.id);
        res.json(deleted);
    } catch (err) {
        console.error("❌ 사용자 삭제 오류:", err);
        res.status(500).json({ message: "사용자를 삭제하는 중 서버 오류가 발생했습니다." });
    }
};
