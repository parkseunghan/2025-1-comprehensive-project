"use strict";
// src/models/userModel.ts
// 사용자 등록
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
let users = [];
const createUser = (username, email, password) => {
    const newUser = { id: users.length + 1, username, email, password };
    users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
const getUsers = () => {
    return users;
};
exports.getUsers = getUsers;
