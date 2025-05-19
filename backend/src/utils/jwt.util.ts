// 📄 src/utils/jwt.util.ts
import jwt, { Secret, SignOptions, JwtPayload as JWTPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: number | StringValue = (process.env.JWT_EXPIRES_IN || "7d") as StringValue;

export interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  gender?: string;
}

export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = JWT_EXPIRES_IN
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    console.error("❌ JWT 검증 실패:", err);
    return null;
  }
};
