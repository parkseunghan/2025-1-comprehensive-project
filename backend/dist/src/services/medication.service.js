"use strict";
// 🔹 medication.service.ts
// 이 파일은 '약물(Medication)' 관련 데이터 처리 및 사용자와의 관계를 다루는 서비스 계층입니다.
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
exports.removeMedicationFromUser = exports.addMedicationToUser = exports.findByUserId = exports.findById = exports.findAll = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/** 전체 약물 목록 조회 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.medication.findMany();
});
exports.findAll = findAll;
/** 특정 ID의 약물 검색 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.medication.findUnique({ where: { id } });
});
exports.findById = findById;
/** userId를 기반으로 사용자의 약물 목록 조회 */
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userMedications = yield prisma_service_1.default.userMedication.findMany({
        where: { userId },
        include: {
            medication: true, // ✅ 약물 정보 포함해서 반환
        },
    });
    return userMedications.map((um) => um.medication);
});
exports.findByUserId = findByUserId;
/** 사용자에게 약물 추가 */
const addMedicationToUser = (userId, medicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield prisma_service_1.default.userMedication.findUnique({
        where: {
            userId_medicationId: { userId, medicationId }, // 복합 unique index
        },
    });
    if (exists) {
        return { message: "Already added" };
    }
    return yield prisma_service_1.default.userMedication.create({
        data: {
            userId,
            medicationId,
        },
    });
});
exports.addMedicationToUser = addMedicationToUser;
/** 사용자의 약물 삭제 */
const removeMedicationFromUser = (userId, medicationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_service_1.default.userMedication.delete({
            where: {
                userId_medicationId: { userId, medicationId },
            },
        });
    }
    catch (err) {
        return { message: "Not found" };
    }
});
exports.removeMedicationFromUser = removeMedicationFromUser;
