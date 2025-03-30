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
exports.getMe = exports.loginUser = exports.signupUser = void 0;
// services/authService.ts
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
// 회원가입 처리
const signupUser = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma.user.create({
        data: { email, password: hashedPassword, name },
    });
    return user;
});
exports.signupUser = signupUser;
// 로그인 처리
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('존재하지 않는 사용자입니다.');
    const validPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!validPassword)
        throw new Error('비밀번호가 일치하지 않습니다.');
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
    return { token };
});
exports.loginUser = loginUser;
// 사용자 정보 조회
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('사용자를 찾을 수 없습니다.');
    const { password } = user, safeUser = __rest(user, ["password"]); // 비밀번호 제외 반환
    return safeUser;
});
exports.getMe = getMe;
