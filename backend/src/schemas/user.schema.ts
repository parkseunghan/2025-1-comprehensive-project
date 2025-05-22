// 📄 src/schemas/user.schema.ts

import { z } from "zod";

// 🔹 사용자 프로필 업데이트 스키마
export const userUpdateSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(["남성", "여성"]), // ✅ 현재 DB 기준 (string)
  age: z.number().min(1).max(120),
  height: z.number().min(50).max(250),
  weight: z.number().min(10).max(300),
  medications: z.array(z.string()).optional(),
  diseases: z.array(z.string()).optional(),
});

// 🔸 타입 추론 가능 (서비스나 타입 정의에서 활용 가능)
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
