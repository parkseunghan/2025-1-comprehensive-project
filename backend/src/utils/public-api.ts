// 📄 src/utils/public-api.ts
import axios from "axios";

const publicAPI = axios.create({
  baseURL: "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService",
  timeout: 10000,
});

export default publicAPI;
