"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
// import symptomRoutes from './src/routes/symptomRoutes';
// 새 라우터
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const disease_routes_1 = __importDefault(require("./src/routes/disease.routes"));
const symptom_routes_1 = __importDefault(require("./src/routes/symptom.routes"));
const record_routes_1 = __importDefault(require("./src/routes/record.routes"));
// .env 파일이 root 경로에 있다는 것을 명시적으로 지정
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
console.log(`Loaded PORT from .env: ${process.env.PORT}`);
console.log(`Using PORT: ${PORT}`);
app.use(body_parser_1.default.json());
// 라우터 연결
app.use('/api/users', authRoutes_1.default);
// app.use('/api/symptoms', symptomRoutes);
// 새 라우터
app.use('/api/users', user_routes_1.default);
app.use('/api/diseases', disease_routes_1.default);
app.use('/api/symptoms', symptom_routes_1.default);
app.use('/api/records', record_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
