// 📄 types/express/index.d.ts
// Express Request 타입 확장 (JWT 인증 이후 req.user 사용을 위함)

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
                gender?: string;
            };
        }
    }
}

export { };
