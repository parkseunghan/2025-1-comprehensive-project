// 📄 src/schemas/user.schema.ts
// 사용자 프로필 입력 및 수정 시 사용하는 Zod 유효성 검사 스키마

import { z } from "zod";

export const genderSchema = z.enum(["남성", "여성"]);

export const userProfileSchema = z.object({
  gender: genderSchema,
  age: z.coerce.number().min(1).max(120),
  height: z.coerce.number().min(50).max(250),
  weight: z.coerce.number().min(10).max(300),
  diseases: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
