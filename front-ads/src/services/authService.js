import api from '../lib/api';

// 사용자 정보 캐싱을 위한 변수
let userCache = null;
let pendingUserPromise = null;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5분 캐시
let cacheTimestamp = null;

// 새로운 상태 구독 시스템
const subscribers = new Set();

// 사용자 정보를 모든 구독자에게 알림
const notifySubscribers = (user) => {
  subscribers.forEach(callback => callback(user));
};

// 사용자 상태 변경 구독하기
export const subscribeToAuthChanges = (callback) => {
  subscribers.add(callback);
  
  // 현재 캐시된 사용자 정보가 있으면 즉시 알림
  if (userCache) {
    callback(userCache);
  } else if (!pendingUserPromise) {
    // 캐시된 정보가 없고 진행 중인 요청도 없으면 새로 요청
    checkAuth();
  }
  
  // 구독 해제 함수 반환
  return () => {
    subscribers.delete(callback);
  };
};

// Login function
export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // 로그인 성공 시 사용자 정보 갱신
    userCache = response.data.user || await checkAuth();
    cacheTimestamp = Date.now();
    notifySubscribers(userCache);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// 소셜 로그인 URL 가져오기
export const socialLogin = (provider) => {
  const redirectUrl = window.location.origin;
  // state 파라미터에 redirect_url을 인코딩하여 포함
  const state = encodeURIComponent(JSON.stringify({ redirectUrl }));
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  window.location.href = `${baseUrl}/auth/${provider}?state=${state}`;
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    // 회원가입 성공 시 캐시 업데이트
    if (response.data.user) {
      userCache = response.data.user;
      cacheTimestamp = Date.now();
      notifySubscribers(userCache);
    }
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
    notifySubscribers(null);
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
      notifySubscribers(userCache);
      return userCache;
    })
    .catch(error => {
      console.error('Error checking auth:', error);
      pendingUserPromise = null;
      userCache = null;
      cacheTimestamp = null;
      notifySubscribers(null);
      return null;
    });

  return pendingUserPromise;
};

// 인증 여부 확인
export const isAuthenticated = async () => {
  const user = await checkAuth();
  return !!user;
};

// 동기식 인증 확인 (캐시된 값만 확인)
export const isAuthenticatedSync = () => {
  return !!userCache;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  return await checkAuth();
};

// 현재 사용자 정보 동기식으로 가져오기 (캐시된 값만 반환)
export const getCurrentUserSync = () => {
  return userCache;
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

// 페이지 로드 시 자동으로 사용자 정보 확인 설정
if (typeof window !== 'undefined') {
  // 페이지 로드 시 한 번 실행
  checkAuth();
  
  // 탭 활성화될 때마다 캐시 유효성 확인
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !isCacheValid()) {
      checkAuth();
    }
  });
}