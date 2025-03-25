// src/models/userModel.ts
// 사용자 등록

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

let users: User[] = [];

export const createUser = (username: string, email: string, password: string) => {
    const newUser: User = { id: users.length + 1, username, email, password };
    users.push(newUser);
    return newUser;
};

export const getUsers = () => {
    return users;
}