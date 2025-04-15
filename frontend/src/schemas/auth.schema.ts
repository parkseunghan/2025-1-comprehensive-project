// 📄 src/schemas/auth.schema.ts
import { z } from "zod";

/** ✅ 로그인 폼 유효성 검사 스키마 */
export const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다."),
});

export type LoginForm = z.infer<typeof loginSchema>;

/** ✅ 회원가입 폼 유효성 검사 스키마 */
export const signupSchema = z
  .object({
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupForm = z.infer<typeof signupSchema>;
