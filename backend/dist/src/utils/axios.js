"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📄 src/utils/axios.ts
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: process.env.AI_API_URL || "http://localhost:8000",
    timeout: 10000,
});
exports.default = instance;
