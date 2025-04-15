"use strict";
// 🔹 user.service.ts
// 사용자 관련 비즈니스 로직을 처리하는 서비스 계층 (Prisma + Zod 기반)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 사용자 ID로 전체 정보 조회 (지병 + 약물 + 증상 기록 + 예측 포함)
 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_service_1.default.user.findUnique({
        where: { id },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } },
            records: {
                include: {
                    symptoms: { include: { symptom: true } },
                    prediction: true,
                },
            },
        },
    });
    if (!user)
        return null;
    const { password } = user, safeUser = __rest(user, ["password"]);
    return Object.assign(Object.assign({}, safeUser), { diseases: user.diseases.map((ud) => ud.disease), medications: user.medications.map((um) => um.medication), records: user.records.map((r) => {
            var _a;
            return (Object.assign(Object.assign({}, r), { symptoms: r.symptoms.map((s) => s.symptom), prediction: (_a = r.prediction) !== null && _a !== void 0 ? _a : null }));
        }) });
});
exports.findById = findById;
/**
 * 사용자 정보 업데이트 (성별/나이/키/몸무게 + 지병 + 약물)
 */
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { diseases, medications } = data, rest = __rest(data, ["diseases", "medications"]);
    // ✅ 필수 필드 누락 방지
    if (!rest.gender ||
        rest.age === undefined ||
        rest.height === undefined ||
        rest.weight === undefined) {
        throw new Error("필수 프로필 항목이 누락되었습니다.");
    }
    // ✅ 유효한 지병 목록 확인
    const validDiseases = yield prisma_service_1.default.disease.findMany({
        where: { name: { in: diseases !== null && diseases !== void 0 ? diseases : [] } },
    });
    const invalidDiseases = diseases === null || diseases === void 0 ? void 0 : diseases.filter((name) => !validDiseases.some((d) => d.name === name));
    if (invalidDiseases === null || invalidDiseases === void 0 ? void 0 : invalidDiseases.length) {
        throw new Error(`유효하지 않은 지병이 포함되어 있습니다: ${invalidDiseases.join(", ")}`);
    }
    // ✅ 유효한 약물 목록 확인
    const validMedications = yield prisma_service_1.default.medication.findMany({
        where: { name: { in: medications !== null && medications !== void 0 ? medications : [] } },
    });
    const invalidMedications = medications === null || medications === void 0 ? void 0 : medications.filter((name) => !validMedications.some((m) => m.name === name));
    if (invalidMedications === null || invalidMedications === void 0 ? void 0 : invalidMedications.length) {
        throw new Error(`유효하지 않은 약물이 포함되어 있습니다: ${invalidMedications.join(", ")}`);
    }
    // ✅ 사용자 정보 업데이트
    return prisma_service_1.default.user.update({
        where: { id },
        data: Object.assign(Object.assign({}, rest), { diseases: {
                deleteMany: {}, // 기존 관계 제거 후 재생성
                create: validDiseases.map((d) => ({
                    disease: { connect: { id: d.id } },
                })),
            }, medications: {
                deleteMany: {},
                create: validMedications.map((m) => ({
                    medication: { connect: { id: m.id } },
                })),
            } }),
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } },
        },
    });
});
exports.update = update;
/**
 * 사용자 삭제
 */
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_service_1.default.user.delete({
        where: { id },
    });
});
exports.remove = remove;
