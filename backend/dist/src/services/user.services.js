"use strict";
// 🔹 user.service.ts
// 사용자 관련 비즈니스 로직을 처리하는 서비스 계층 (Prisma 버전)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * 사용자 ID로 전체 정보 조회 (지병 + 증상기록 + 증상 + 예측 포함)
 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { id },
        include: {
            diseases: {
                include: {
                    disease: true,
                },
            },
            records: {
                include: {
                    symptoms: {
                        include: {
                            symptom: true,
                        },
                    },
                    prediction: true,
                },
            },
        },
    });
});
exports.findById = findById;
/**
 * 사용자 정보 업데이트
 */
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.update({
        where: { id },
        data,
    });
});
exports.update = update;
/**
 * 사용자 삭제
 */
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.delete({
        where: { id },
    });
});
exports.remove = remove;
