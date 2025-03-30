import { PrismaClient } from "@prisma/client";
import path from "path";
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

export default prisma;