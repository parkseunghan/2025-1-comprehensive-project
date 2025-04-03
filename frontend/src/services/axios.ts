// axios.ts
// 모든 API 요청에 대해 공통 설정을 적용한 Axios 인스턴스를 생성합니다.
// JWT 토큰을 AsyncStorage에서 꺼내 Authorization 헤더에 자동으로 붙입니다.

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ✅ baseURL 설정
const baseURL =
    Platform.OS === "android"
        ? "http://10.0.2.2:5000/api" // Android 에뮬레이터 전용 IP
        : "http://localhost:5000/api"; // 웹 or iOS (로컬 환경)

const axiosInstance = axios.create({

    //   baseURL: "http://10.0.2.2:5000/api", // Android 에뮬레이터 기준, 백엔드 API 주소
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ 요청 시 토큰 자동 첨부
axiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
