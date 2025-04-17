"use strict";
// 🔹 user.controller.ts
// 사용자 API 요청을 처리하는 Express 컨트롤러입니다.
// 요청 유효성 검사(Zod) → 서비스 호출 → 응답 반환
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
const userService = __importStar(require("../services/user.services"));
const user_schema_1 = require("../schemas/user.schema");
const zod_1 = require("zod");
/**
 * 🔹 GET /users/:id
 * 사용자 ID로 전체 프로필 정보 조회
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }
        res.json(user);
    }
    catch (err) {
        console.error("❌ 사용자 조회 오류:", err);
        res.status(500).json({ message: "사용자 조회 중 서버 오류가 발생했습니다." });
    }
});
exports.getUserById = getUserById;
/**
 * 🔹 PATCH /users/:id
 * 사용자 정보 수정
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ✅ 요청 본문 유효성 검사 (Zod)
        const parsed = user_schema_1.userUpdateSchema.parse(req.body);
        // 🔄 서비스 로직 호출
        const updated = yield userService.update(req.params.id, parsed);
        res.json(updated);
    }
    catch (err) {
        // ⚠️ 유효성 검사 실패 시 400 반환
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                message: "입력값이 유효하지 않습니다.",
                errors: err.flatten(), // ✅ 더 보기 좋은 형태
            });
            return;
        }
        console.error("❌ 사용자 업데이트 오류:", err);
        res.status(500).json({ message: "사용자 정보를 수정하는 중 서버 오류가 발생했습니다." });
    }
});
exports.updateUser = updateUser;
/**
 * 🔹 DELETE /users/:id
 * 사용자 삭제
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield userService.remove(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        console.error("❌ 사용자 삭제 오류:", err);
        res.status(500).json({ message: "사용자를 삭제하는 중 서버 오류가 발생했습니다." });
    }
});
exports.deleteUser = deleteUser;
