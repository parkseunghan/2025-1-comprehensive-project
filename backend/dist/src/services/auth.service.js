"use strict";
// 🔹 auth.service.ts
// 사용자 인증 비즈니스 로직 서비스
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
exports.getUserInfo = exports.loginUser = exports.signupUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_util_1 = require("../utils/jwt.util");
const prisma = new client_1.PrismaClient();
/**
 * 신규 사용자를 회원가입 처리합니다.
 */
const signupUser = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 비밀번호 해싱
    return prisma.user.create({
        data: { email, password: hashedPassword, name },
    });
});
exports.signupUser = signupUser;
/**
 * 사용자를 로그인 처리 후 JWT 토큰을 발급합니다.
 */
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { email } }); // 이메일로 사용자 찾기
    if (!user)
        throw new Error('존재하지 않는 사용자입니다.');
    const validPassword = yield bcrypt_1.default.compare(password, user.password); // 비밀번호 비교
    if (!validPassword)
        throw new Error('비밀번호가 일치하지 않습니다.');
    const token = (0, jwt_util_1.generateToken)({ id: user.id, email: user.email }); // JWT 토큰 생성
    return { token };
});
exports.loginUser = loginUser;
/**
 * 사용자 ID로 사용자 정보를 조회합니다.
 */
const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id: userId } }); // 사용자 조회
    if (!user)
        throw new Error('사용자를 찾을 수 없습니다.');
    const { password } = user, userInfo = __rest(user, ["password"]); // 비밀번호 제거 후 반환
    return userInfo;
});
exports.getUserInfo = getUserInfo;
