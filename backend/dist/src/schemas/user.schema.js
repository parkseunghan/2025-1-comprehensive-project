"use strict";
// 📄 src/schemas/user.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = void 0;
const zod_1 = require("zod");
// 🔹 사용자 프로필 업데이트 스키마
exports.userUpdateSchema = zod_1.z.object({
    gender: zod_1.z.enum(["남성", "여성"]), // ✅ 현재 DB 기준 (string)
    age: zod_1.z.number().min(1).max(120),
    height: zod_1.z.number().min(50).max(250),
    weight: zod_1.z.number().min(10).max(300),
    medications: zod_1.z.array(zod_1.z.string()).optional(),
    diseases: zod_1.z.array(zod_1.z.string()).optional(),
});
