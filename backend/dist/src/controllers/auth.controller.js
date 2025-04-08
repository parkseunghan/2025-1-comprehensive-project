"use strict";
// 🔹 auth.controller.ts
// 이 파일은 인증(Authentication) 관련 요청을 처리하는 컨트롤러입니다.
// 회원가입, 로그인, 사용자 정보 조회 기능을 제공합니다.
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
exports.getMe = exports.login = exports.signup = void 0;
const authService = __importStar(require("../services/auth.service"));
const jwt_util_1 = require("../utils/jwt.util");
/**
 * 사용자 회원가입 요청 처리
 * POST /auth/register
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const result = yield authService.signup({ email, password, name });
    // 이메일 중복 시
    if ("message" in result) {
        res.status(400).json({ message: result.message });
        return;
    }
    // ✅ 토큰 발급 및 응답
    const token = (0, jwt_util_1.generateToken)({
        id: result.id,
        email: result.email,
        name: result.name,
    });
    res.status(201).json({
        token,
        user: {
            id: result.id,
            email: result.email,
            name: result.name,
        },
    });
    return;
});
exports.signup = signup;
/**
 * 사용자 로그인 요청 처리
 * POST /auth/login
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield authService.login(email, password);
    if (!result) {
        res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        return;
    }
    res.json(result); // 이미 { token, user } 구조
    return;
});
exports.login = login;
/**
 * 로그인된 사용자 정보 조회
 * GET /auth/me
 */
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "인증 정보가 없습니다." });
        return;
    }
    const user = yield authService.getUserById(userId);
    if (!user) {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        return;
    }
    res.json(user);
    return;
});
exports.getMe = getMe;
