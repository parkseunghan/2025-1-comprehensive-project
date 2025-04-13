"use strict";
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
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_service_1.default.user.findUnique({
        where: { id },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } }, // ✅ 추가
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
    return Object.assign(Object.assign({}, safeUser), { diseases: user.diseases.map((ud) => ud.disease), medications: user.medications.map((um) => um.medication), records: user.records.map((r) => (Object.assign(Object.assign({}, r), { symptoms: r.symptoms.map((s) => s.symptom) }))) });
});
exports.findById = findById;
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { diseases, medications } = data, rest = __rest(data, ["diseases", "medications"]);
    // 🔸 1. 질병/약물 존재 여부 확인
    const validDiseases = yield prisma_service_1.default.disease.findMany({
        where: { name: { in: diseases !== null && diseases !== void 0 ? diseases : [] } },
    });
    const validMedications = yield prisma_service_1.default.medication.findMany({
        where: { name: { in: medications !== null && medications !== void 0 ? medications : [] } },
    });
    // 🔸 2. 존재하지 않는 항목이 있다면 예외 처리
    if (((diseases === null || diseases === void 0 ? void 0 : diseases.length) || 0) !== validDiseases.length) {
        throw new Error("유효하지 않은 지병이 포함되어 있습니다.");
    }
    if (((medications === null || medications === void 0 ? void 0 : medications.length) || 0) !== validMedications.length) {
        throw new Error("유효하지 않은 약물이 포함되어 있습니다.");
    }
    // 🔸 3. 업데이트 수행
    return prisma_service_1.default.user.update({
        where: { id },
        data: Object.assign(Object.assign({}, rest), { diseases: {
                deleteMany: {},
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
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_service_1.default.user.delete({
        where: { id },
    });
});
exports.remove = remove;
