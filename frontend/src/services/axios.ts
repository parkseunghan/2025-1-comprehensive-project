// 📄 src/services/axios.ts

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// ✅ .env에서 받은 API_URL에 항상 /api 붙이기
let baseURL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:5000";


if (!baseURL.endsWith("/api")) {
    baseURL = `${baseURL.replace(/\/$/, "")}/api`; // 중복 슬래시 방지해서 /api 붙임
}
// console.log("✅ [axios.ts] 최종 baseURL:", baseURL);
const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },

});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
