"use strict";
// 🔹 disease.service.ts
// 이 파일은 '지병' 객체와 사용자의 객체 간의 관계를 개발적으로 처리하는 서비스 계층입니다.
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
exports.removeDiseaseFromUser = exports.addDiseaseToUser = exports.findByUserId = exports.findById = exports.findAll = exports.getAllDiseases = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 전체 질병 리스트 조회
 */
const getAllDiseases = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.disease.findMany({
        orderBy: {
            name: "asc",
        },
    });
});
exports.getAllDiseases = getAllDiseases;
/** 전체 지병 목록 조회 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.disease.findMany();
});
exports.findAll = findAll;
/** 특정 ID의 지병 검색 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.disease.findUnique({ where: { id } });
});
exports.findById = findById;
/** userId를 기반으로 사용자의 지병 목록 조회 */
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userDiseases = yield prisma_service_1.default.userDisease.findMany({
        where: { userId },
        include: {
            disease: true, // ✅ 지병 정보 포함해서 반환
        },
    });
    return userDiseases.map((ud) => ud.disease);
});
exports.findByUserId = findByUserId;
/** 사용자에게 지병 추가 */
const addDiseaseToUser = (userId, diseaseId) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield prisma_service_1.default.userDisease.findUnique({
        where: {
            userId_diseaseId: { userId, diseaseId }, // 복합 unique index
        },
    });
    if (exists) {
        return { message: "Already added" };
    }
    return yield prisma_service_1.default.userDisease.create({
        data: {
            userId,
            diseaseId,
        },
    });
});
exports.addDiseaseToUser = addDiseaseToUser;
/** 사용자의 지병 삭제 */
const removeDiseaseFromUser = (userId, diseaseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_service_1.default.userDisease.delete({
            where: {
                userId_diseaseId: { userId, diseaseId },
            },
        });
    }
    catch (err) {
        return { message: "Not found" };
    }
});
exports.removeDiseaseFromUser = removeDiseaseFromUser;
