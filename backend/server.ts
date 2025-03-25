import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from './src/routes/authRoutes';

// .env 파일이 root 경로에 있다는 것을 명시적으로 지정
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

const PORT = process.env.PORT || 5000;

console.log(`Loaded PORT from .env: ${process.env.PORT}`);
console.log(`Using PORT: ${PORT}`);

app.use(bodyParser.json());



// 라우터 연결
app.use('/api/users', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
