// 📄 src/services/axios.ts
// Axios 인스턴스 설정
// - 플랫폼별 baseURL 구성
// - 요청 시 JWT 토큰 자동 첨부

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 🔸 플랫폼에 따라 baseURL 자동 설정
const baseURL =
    Platform.OS === "android"
        ? "http://10.0.2.2:5000/api" // Android 에뮬레이터 전용
        : "http://localhost:5000/api"; // iOS 시뮬레이터, 웹

// 🔹 공통 axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 요청 시 JWT 토큰 자동 첨부 (AsyncStorage 기반)
axiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
