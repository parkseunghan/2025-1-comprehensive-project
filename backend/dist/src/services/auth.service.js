"use strict";
// 🔹 auth.service.ts
// 이 파일은 인증 로직을 처리하는 서비스 계층입니다.
// 더미 사용자 배열을 기반으로 회원가입 및 로그인 로직을 구현합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const users_1 = require("../mock/users");
const uuid_1 = require("uuid");
const jwt_util_1 = require("../utils/jwt.util");
/**
 * 회원가입 요청 처리
 */
const register = (data) => {
    var _a;
    const exists = users_1.users.find((u) => u.email === data.email);
    if (exists) {
        return { message: "이미 등록된 이메일입니다." };
    }
    const newUser = {
        id: (0, uuid_1.v4)(),
        email: data.email,
        password: data.password,
        name: (_a = data.name) !== null && _a !== void 0 ? _a : "",
        gender: "",
        age: 0,
        height: 0,
        weight: 0,
        medications: [],
        createdAt: new Date().toISOString(),
    };
    users_1.users.push(newUser);
    return newUser;
};
exports.register = register;
/**
 * 로그인 요청 처리
 */
const login = (email, password) => {
    const user = users_1.users.find((u) => u.email === email && u.password === password);
    if (!user)
        return null;
    const token = (0, jwt_util_1.generateToken)({
        id: user.id,
        email: user.email,
        name: user.name
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};
exports.login = login;
