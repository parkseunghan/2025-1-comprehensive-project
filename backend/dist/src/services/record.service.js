"use strict";
// 🔹 record.service.ts
// 이 파일은 증상 기록(SymptomRecord) 관련 비즈니스 로직을 처리하는 서비스 계층입니다.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.findById = exports.findByUserId = exports.create = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/** 증상 기록 생성 */
const create = (userId, symptomIds) => __awaiter(void 0, void 0, void 0, function* () {
    const newRecord = yield prisma_service_1.default.symptomRecord.create({
        data: {
            userId,
            symptoms: {
                create: symptomIds.map((symptomId) => ({
                    symptomId,
                })),
            },
        },
        include: {
            symptoms: {
                include: {
                    symptom: true,
                },
            },
        },
    });
    return newRecord;
});
exports.create = create;
/** 사용자 ID로 해당 사용자의 증상 기록 전체 조회 */
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.symptomRecord.findMany({
        where: { userId },
        include: {
            symptoms: {
                include: {
                    symptom: true,
                },
            },
            prediction: true,
        },
    });
});
exports.findByUserId = findByUserId;
/** 특정 증상 기록 ID로 조회 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.symptomRecord.findUnique({
        where: { id },
        include: {
            symptoms: {
                include: {
                    symptom: true,
                },
            },
            prediction: true,
        },
    });
});
exports.findById = findById;
/** 특정 증상 기록 삭제 */
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_service_1.default.symptomRecord.delete({
            where: { id },
        });
    }
    catch (_a) {
        return null;
    }
});
exports.remove = remove;
