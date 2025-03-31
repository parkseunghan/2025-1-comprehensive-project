"use strict";
// 🔹 auth.service.ts
// 이 파일은 인증 로직을 처리하는 서비스 계층입니다.
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
exports.login = exports.register = void 0;
const uuid_1 = require("uuid");
const jwt_util_1 = require("../utils/jwt.util");
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 회원가입 요청 처리 (DB 저장)
 */
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const exists = yield prisma_service_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (exists) {
        return { message: "이미 등록된 이메일입니다." };
    }
    const newUser = yield prisma_service_1.default.user.create({
        data: {
            id: (0, uuid_1.v4)(),
            email: data.email,
            password: data.password,
            name: (_a = data.name) !== null && _a !== void 0 ? _a : "",
            gender: "",
            age: 0,
            height: 0,
            weight: 0,
            medications: [],
        },
    });
    return newUser;
});
exports.register = register;
/**
 * 로그인 요청 처리 (DB 조회 → 토큰 발급)
 */
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_service_1.default.user.findUnique({
        where: { email },
    });
    if (!user || user.password !== password)
        return null;
    const token = (0, jwt_util_1.generateToken)({
        id: user.id,
        email: user.email,
        name: user.name,
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
});
exports.login = login;
