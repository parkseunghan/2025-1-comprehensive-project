"use strict";
// 🔹 symptom.service.ts
// 이 파일은 '증상(Symptom)' 데이터를 더미 기반으로 조회하는 서비스 계층입니다.
// 전체 목록과 특정 ID로 검색하는 기능을 제공합니다.
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
exports.findById = exports.findAll = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 전체 증상 목록을 반환합니다.
 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.symptom.findMany();
});
exports.findAll = findAll;
/**
 * 특정 ID에 해당하는 증상을 반환합니다.
 * @param id 증상 ID
 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.symptom.findUnique({
        where: { id },
    });
});
exports.findById = findById;
