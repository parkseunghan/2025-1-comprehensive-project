"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./src/routes"));
// .env 파일이 root 경로에 있다는 것을 명시적으로 지정
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
console.log(`Loaded PORT from .env: ${process.env.PORT}`);
console.log(`Using PORT: ${PORT}`);
app.use(body_parser_1.default.json());
// 라우터 연결
app.use('/api', routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
