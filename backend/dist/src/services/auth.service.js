"use strict";
// 📄 services/auth.service.ts
// 인증 로직 처리 (회원가입, 로그인, 사용자 조회)
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
exports.getUserById = exports.login = exports.signup = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 🔹 회원가입
 */
const signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const exists = yield prisma_service_1.default.user.findUnique({ where: { email: data.email } });
    if (exists) {
        return { message: "이미 등록된 이메일입니다." };
    }
    const newUser = yield prisma_service_1.default.user.create({
        data: {
            email: data.email,
            password: data.password,
            name: (_a = data.name) !== null && _a !== void 0 ? _a : "",
            gender: "",
            age: 0,
            height: 0,
            weight: 0,
            bmi: 0,
        },
    });
    return {
        id: newUser.id,
        email: newUser.email,
        name: (_b = newUser.name) !== null && _b !== void 0 ? _b : undefined,
    };
});
exports.signup = signup;
/**
 * 🔹 로그인
 */
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield prisma_service_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            gender: true,
            password: true,
        },
    });
    if (!user || user.password !== password)
        return null;
    const token = (0, jwt_util_1.generateToken)({
        id: user.id,
        email: user.email,
        name: (_a = user.name) !== null && _a !== void 0 ? _a : "",
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: (_b = user.name) !== null && _b !== void 0 ? _b : undefined,
            gender: user.gender,
        },
    };
});
exports.login = login;
/**
 * 🔹 사용자 조회 (GET /auth/me)
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma_service_1.default.user.findUnique({
        where: { id },
    });
    if (!user)
        return null;
    const { password } = user, safeUser = __rest(user, ["password"]);
    return Object.assign(Object.assign({}, safeUser), { name: (_a = user.name) !== null && _a !== void 0 ? _a : undefined });
});
exports.getUserById = getUserById;
