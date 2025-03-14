import axios from 'axios';

// 라우터 참조를 저장할 전역 변수
let router;

// 라우터 설정 함수 (애플리케이션 초기화 시 호출)
export const setRouter = (nextRouter) => {
  router = nextRouter;
};

// 토큰 관련 헬퍼 함수
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

// Create an axios instance with the base URL of your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials는 더 이상 필요없음 (쿠키를 사용하지 않으므로)
  withCredentials: false,
});

// 요청 인터셉터 - Authorization 헤더에 Bearer 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const originalUrl = config.url;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Vercel이나 ngrok에서 문제 디버깅을 위한 로그 추가
      if (process.env.NODE_ENV !== 'production') {
        console.log(`API 요청: ${config.method.toUpperCase()} ${originalUrl}`, {
          baseURL: config.baseURL,
          hasToken: !!token,
          tokenLength: token ? token.length : 0
        });
      }
    } else {
      console.warn(`토큰 없이 API 요청: ${config.method.toUpperCase()} ${originalUrl}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.log('API 오류 발생:', {
      status: error.response?.status,
      url: originalRequest.url,
      method: originalRequest.method,
      hasAuthHeader: !!originalRequest.headers.Authorization
    });
    
    // 토큰 만료 오류이고, 재시도하지 않은 요청인 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // 리프레시 토큰이 있는 경우에만 토큰 갱신 시도
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // 토큰 갱신 시도 - 원래 요청의 인터셉터를 피하기 위해 별도 인스턴스 사용
          const tokenResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh-token`,
            { refreshToken }
          );
          
          if (tokenResponse.data.accessToken) {
            // 새 토큰 저장
            localStorage.setItem('accessToken', tokenResponse.data.accessToken);
            localStorage.setItem('refreshToken', tokenResponse.data.refreshToken);
            
            // 원래 요청에 새 토큰 적용하고 재시도
            originalRequest.headers.Authorization = `Bearer ${tokenResponse.data.accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
        }
      }
      
      // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        const returnUrl = encodeURIComponent(window.location.pathname);
        if (router) {
          router.push(`/auth/login?returnUrl=${returnUrl}`);
        } else {
          window.location.href = `/auth/login?returnUrl=${returnUrl}`;
        }
        
        // 토큰 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;