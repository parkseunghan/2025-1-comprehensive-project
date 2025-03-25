"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
//디버깅용
/*
const users = [
    { id: 1, username: 'john_doe', email: 'john@example.com', password: 'securepassword' },
    { id: 2, username: 'jane_doe', email: 'jane@example.com', password: 'anotherpassword' }
];
*/
const registerUser = (req, res) => {
    const { username, email, password } = req.body;
    console.log('받은 요청 본문:', req.body); // 요청 본문 확인
    // 입력된 데이터가 모두 있는지 확인
    if (!username || !email || !password) {
        res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        console.log('모든 필드를 입력해주세요.');
        return;
    }
    // 사용자 생성
    const newUser = (0, userModel_1.createUser)(username, email, password);
    //디버깅용
    /*
    const newUser = {
        id: users.length + 1, // 간단하게 ID는 기존 배열의 길이에 +1을 해줌
        username,
        email,
        password
    };
    users.push(newUser);
    */
    res.status(201).json({
        message: '사용자가 성공적으로 등록되었습니다.',
        user: newUser
    });
    console.log('사용자가 성공적으로 등록되었습니다.', newUser);
};
exports.registerUser = registerUser;
