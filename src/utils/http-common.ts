import axios from "axios";

import Config from "./config";

const httpCommon = axios.create({
  baseURL: Config.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

httpCommon.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default httpCommon;
