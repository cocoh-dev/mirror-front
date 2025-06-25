// lib/api.js
import axios from "axios";
import { logout, refreshAuthToken } from "@/services/authService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 중요: 쿠키를 포함하도록 설정
});

// 토큰 갱신 중인지 추적하는 변수
let isRefreshing = false;
// 토큰 갱신 중에 대기하는 요청들을 저장하는 배열
let refreshSubscribers = [];

// 토큰 재발급 후 대기 중인 요청들을 재시도하는 함수
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// 응답 인터셉터 수정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 로그인 요청에서의 401 오류는 토큰 갱신으로 처리하지 않고 그대로 전달
    if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // 401 에러이고, 재시도하지 않은 경우에만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 재발급 요청
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          onRefreshed();
          return api(originalRequest);
        } else {
          // 토큰 갱신 실패 시
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
