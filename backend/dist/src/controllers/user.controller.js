"use strict";
// 🔹 user.controller.ts
// 이 파일은 사용자 API 요청을 처리하는 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고, 서비스 로직을 호출하며, 응답을 반환합니다.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteUser = exports.updateUser = exports.getUserById = void 0;
const userService = __importStar(require("../services/user.services")); // 사용자 서비스 로직 호출
/**
 * 사용자 ID로 사용자 조회 (Prisma 버전)
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        return;
    }
    // 🔹 diseases 배열을 평탄화해 name만 추출
    const formatted = Object.assign(Object.assign({}, user), { diseases: user.diseases.map((ud) => ud.disease), records: user.records.map((r) => (Object.assign(Object.assign({}, r), { symptoms: r.symptoms.map((s) => s.symptom) }))) });
    res.json(formatted);
});
exports.getUserById = getUserById;
/**
 * 사용자 정보 업데이트
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield userService.update(req.params.id, req.body);
    res.json(updated);
});
exports.updateUser = updateUser;
/**
 * 사용자 삭제
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield userService.remove(req.params.id);
    res.json(deleted);
});
exports.deleteUser = deleteUser;
