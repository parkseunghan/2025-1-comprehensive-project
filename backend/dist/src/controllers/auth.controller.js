"use strict";
// 🔹 auth.controller.ts
// 사용자 인증 API 요청을 처리하는 컨트롤러
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
exports.me = exports.login = exports.signup = void 0;
const auth_service_1 = require("../services/auth.service");
/**
 * 회원가입 요청 처리
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body; // 요청 데이터 추출
    const user = yield (0, auth_service_1.signupUser)(email, password, name); // 서비스 호출
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
});
exports.signup = signup;
/**
 * 로그인 요청 처리
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body; // 요청 데이터 추출
    const { token } = yield (0, auth_service_1.loginUser)(email, password); // 서비스 호출
    res.json({ token });
});
exports.login = login;
/**
 * 현재 로그인한 사용자 정보 조회 처리
 */
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // JWT에서 추출된 사용자 ID
    const userInfo = yield (0, auth_service_1.getUserInfo)(userId); // 서비스 호출
    res.json(userInfo);
});
exports.me = me;
