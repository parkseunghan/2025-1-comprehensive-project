"use strict";
// 📄 controllers/auth.controller.ts
// 인증 관련 API 컨트롤러 (회원가입, 로그인, 사용자 조회)
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
 * 🔹 회원가입
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, name } = req.body;
    const result = yield authService.signup({ email, password, name });
    if ("message" in result) {
        res.status(400).json({ message: result.message });
        return;
    }
    const token = (0, jwt_util_1.generateToken)({
        id: result.id,
        email: result.email,
        name: (_a = result.name) !== null && _a !== void 0 ? _a : "",
    });
    res.status(201).json({
        token,
        user: {
            id: result.id,
            email: result.email,
            name: result.name,
            gender: "", // ✅ 회원가입 직후는 빈 값으로 처리 가능
        },
    });
});
exports.signup = signup;
/**
 * 🔹 로그인
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield authService.login(email, password);
    if (!result) {
        res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        return;
    }
    res.json(result); // ✅ result.user.gender 포함됨
});
exports.login = login;
/**
 * 🔹 로그인된 사용자 정보 조회
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
});
exports.getMe = getMe;
