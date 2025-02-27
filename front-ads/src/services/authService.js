import api from '../lib/api';

// 사용자 정보 캐싱을 위한 변수
let userCache = null;
let pendingUserPromise = null;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5분 캐시
let cacheTimestamp = null;

// Login function
export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // 로그인 성공 시 캐시 초기화
    invalidateCache();
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Logout function
export const logout = async () => {
  try {
    // 로그아웃 시 캐시 초기화
    invalidateCache();
    // 백엔드에 로그아웃 요청
    await api.get('/auth/logout');
    window.location.href = '/auth/login';
  } catch (error) {
    console.error('Logout error:', error);
    // 오류가 있어도 로그인 페이지로 리다이렉트
    window.location.href = '/auth/login';
  }
};

// 캐시 초기화 함수
const invalidateCache = () => {
  userCache = null;
  pendingUserPromise = null;
  cacheTimestamp = null;
};

// 캐시가 유효한지 확인
const isCacheValid = () => {
  return userCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_EXPIRY);
};

// 사용자 정보 확인 함수 (캐싱 적용)
export const checkAuth = async () => {
  // 이미 진행 중인 요청이 있으면 그 결과를 기다림
  if (pendingUserPromise) {
    return pendingUserPromise;
  }
  
  // 캐시가 유효하면 캐시된 데이터 반환
  if (isCacheValid()) {
    return userCache;
  }
  
  // 새 요청 실행
  pendingUserPromise = api.get('/auth/me')
    .then(response => {
      userCache = response.data.user;
      cacheTimestamp = Date.now();
      pendingUserPromise = null;
      return userCache;
    })
    .catch(error => {
      console.error('Error checking auth:', error);
      pendingUserPromise = null;
      userCache = null;
      cacheTimestamp = null;
      return null;
    });

  return pendingUserPromise;
};

// 인증 여부 확인
export const isAuthenticated = async () => {
  const user = await checkAuth();
  return !!user;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  return await checkAuth();
};

// 비밀번호 초기화 요청
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset request failed' };
  }
};

// 비밀번호 재설정
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { 
      token, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};