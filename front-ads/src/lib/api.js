import axios from 'axios';

// 라우터 참조를 저장할 전역 변수
let router;

// 라우터 설정 함수 (애플리케이션 초기화 시 호출)
export const setRouter = (nextRouter) => {
  router = nextRouter;
};

// Create an axios instance with the base URL of your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for cookie-based auth
  withCredentials: true,
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 감지
    if (error.response && error.response.status === 401) {
      // 클라이언트 측에서만 실행 (브라우저 환경)
      if (typeof window !== 'undefined') {
        // 라우터가 설정되어 있으면 사용, 아니면 window.location 사용
        const returnUrl = encodeURIComponent(window.location.pathname);
        if (router) {
          router.push(`/auth/login?returnUrl=${returnUrl}`);
        } else {
          window.location.href = `/auth/login?returnUrl=${returnUrl}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;