// src/controllers/userController.ts
// getUserInfo(사용자 정보 조회) API

import { Request, Response } from 'express';

// 사용자 정보 더미데이터
const users = [
    { id: 1, username: 'john_doe', email: 'john@example.com', password: 'securepassword' },
    { id: 2, username: 'jane_doe', email: 'jane@example.com', password: 'anotherpassword' }
];

export const getUserInfo = (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === parseInt(userId))

    if (!user) {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    res.status(200).json({
        messege: '사용자 조회에 성공했습니다.',
        user
    });
}