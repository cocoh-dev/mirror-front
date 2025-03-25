import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';

// 사용자 정보 캐싱을 위한 변수
let pendingUserPromise = null;
const CACHE_EXPIRY = 30 * 60 * 1000; // 30분으로 증가

// 토큰 갱신 중인지 추적하는 변수
let isRefreshing = false;

// userCache와 cacheTimestamp를 localStorage에 저장/로드하는 함수
const saveCache = (user, timestamp) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('auth_user_cache', JSON.stringify(user));
    localStorage.setItem('auth_user_cache_timestamp', timestamp.toString());
  } catch (e) {
    console.error('캐시 저장 실패:', e);
  }
};

const loadCache = () => {
  if (typeof window === 'undefined') return { user: null, timestamp: null };
  
  try {
    const user = JSON.parse(localStorage.getItem('auth_user_cache') || 'null');
    const timestamp = parseInt(localStorage.getItem('auth_user_cache_timestamp') || '0');
    return { user, timestamp };
  } catch (e) {
    console.error('캐시 로드 실패:', e);
    return { user: null, timestamp: null };
  }
};

// 초기화 코드: 변수를 localStorage에서 로드
let { user: userCache, timestamp: cacheTimestamp } = loadCache();

const getTokenExpiryFromCookie = () => {
  try {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    
    if (!tokenCookie) return null;
    
    // 쿠키에서 토큰 값만 추출
    const token = tokenCookie.split('=')[1];
    
    if (!token) return null;
    
    // jwt-decode를 사용하여 토큰 디코딩
    try {
      const decoded = jwtDecode(token);
      
      if (decoded.exp) {
        return decoded.exp * 1000; // 초를 밀리초로 변환
      }
    } catch (e) {
      // console.log('JWT 디코딩 실패:', e);
    }
    
    return null;
  } catch (e) {
    console.error('토큰 만료 시간 확인 오류:', e);
    return null;
  }
};

// 새로운 상태 구독 시스템
const subscribers = new Set();

// URL에서 토큰 추출 함수 수정 (이제 쿠키를 사용하므로 간소화)
export const extractTokensFromUrl = async () => {
  if (typeof window === 'undefined') return null;
  
  // OAuth 리다이렉트 확인 (state 파라미터 등 활용)
  const urlParams = new URLSearchParams(window.location.search);
  const hasOAuthParams = urlParams.has('state') || urlParams.has('code');
  
  if (hasOAuthParams) {
    // console.log('OAuth 리다이렉트 감지');
    
    // URL 파라미터 제거 (보안)
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    // 사용자 정보 로드
    try {
      const user = await checkAuth();
      // console.log('OAuth 로그인 성공 - 사용자 정보 로드됨:', user ? '성공' : '실패');
      return { user };
    } catch (err) {
      console.error('OAuth 로그인 후 사용자 정보 로드 실패:', err);
    }
  }
  
  return null;
};

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
    // 에러 메시지 추출 및 형식화
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Login failed';
    
    throw { message: errorMessage };
  }
};

// refreshAuthToken 함수 수정 - HttpOnly 쿠키 문제 해결
export const refreshAuthToken = async () => {
  // 이미 갱신 중이면 중복 요청 방지
  if (isRefreshing) {
    return new Promise(resolve => {
      const checkRefreshComplete = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(checkRefreshComplete);
          resolve(!!userCache);
        }
      }, 100);
    });
  }
  
  // 쿨다운 로직 강화
  const lastRefreshFail = localStorage.getItem('lastRefreshFail');
  const lastSuccessfulRefresh = localStorage.getItem('lastSuccessfulRefresh');
  const failCooldown = 30000; // 30초로 증가 (기존 10초)
  const successCooldown = 60000; // 성공 후 1분간 추가 갱신 방지
  
  // 최근 실패 후 쿨다운
  if (lastRefreshFail && Date.now() - parseInt(lastRefreshFail) < failCooldown) {
    return false;
  }
  
  // 최근 성공 후 쿨다운 (새로 추가)
  if (lastSuccessfulRefresh && Date.now() - parseInt(lastSuccessfulRefresh) < successCooldown) {
    return true; // 최근에 성공했으면 토큰이 유효하다고 가정
  }
  
  isRefreshing = true;
  
  try {
    // 토큰 갱신 요청
    const response = await api.post('/auth/refresh-token');
    
    // 갱신 성공 시 사용자 정보 업데이트
    userCache = response.data.user;
    cacheTimestamp = Date.now();
    
    // 성공 기록 저장 (새로 추가)
    localStorage.setItem('lastSuccessfulRefresh', Date.now().toString());
    localStorage.removeItem('lastRefreshFail');
    
    notifySubscribers(userCache);
    
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    if (error.response?.status === 401) {
      invalidateCache();
      notifySubscribers(null);
    }
    
    localStorage.setItem('lastRefreshFail', Date.now().toString());
    
    return false;
  } finally {
    isRefreshing = false;
  }
};

export const signUp = (userData) => {
  return api.post('/auth/signup', userData);
};

// 소셜 로그인 URL 가져오기
export const socialLogin = (provider, returnUrl) => {
  const redirectUrl = window.location.origin;
  // state 파라미터에 redirect_url을 인코딩하여 포함
  const encodedState = encodeURIComponent(JSON.stringify({
    redirectUrl: window.location.origin,
    returnUrl: returnUrl // 로그인 후 리다이렉트할 경로
  }));
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  window.location.href = `${baseUrl}/auth/${provider}?state=${encodedState}`;
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
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 캐시 초기화
    invalidateCache();
    
    // 구독자에게 로그아웃 알림
    notifySubscribers(null);
    
    // 수동으로 쿠키 제거 (브라우저 환경에서만)
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // 도메인이 설정된 경우에 대비
      const domain = window.location.hostname;
      document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    }
    
    // 페이지 리다이렉트 (사용자에게 로그아웃 피드백 제공)
    window.location.href = '/auth/login';
  }
};

// invalidateCache 함수 수정
const invalidateCache = () => {
  userCache = null;
  pendingUserPromise = null;
  cacheTimestamp = null;
  
  // localStorage에서도 캐시 삭제
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user_cache');
    localStorage.removeItem('auth_user_cache_timestamp');
  }
};

// 캐시가 유효한지 확인
const isCacheValid = () => {
  if (!userCache || !cacheTimestamp) {
    return false;
  }
  
  // 토큰 만료 시간 확인
  const tokenExpiry = getTokenExpiryFromCookie();
  
  if (tokenExpiry) {
    // 만료 버퍼 시간 늘리기 - 만료 30분 전부터 갱신 시도 (기존 10분)
    const tokenValidityBuffer = 30 * 60 * 1000;
    return Date.now() < (tokenExpiry - tokenValidityBuffer);
  }
  
  // 캐시 만료 시간 기준
  return (Date.now() - cacheTimestamp) < CACHE_EXPIRY;
};

// checkAuth 함수 수정
// authService.js의 checkAuth 함수 수정
export const checkAuth = async () => {
  // 디버깅 로그 추가
  console.log('checkAuth 호출됨, 현재 캐시:', !!userCache);
  
  // 이미 진행 중인 요청이 있으면 기다림
  if (pendingUserPromise) {
    console.log('진행 중인 요청이 있어 대기함');
    return pendingUserPromise;
  }
  
  // 캐시가 유효하면 캐시 반환
  if (isCacheValid()) {
    console.log('캐시가 유효함, 캐시된 사용자 반환');
    return userCache;
  }
  
  console.log('/auth/me API 요청 시작');
  
  // 새 API 요청 시작
  pendingUserPromise = api.get('/auth/me')
    .then(response => {
      console.log('/auth/me 응답 성공:', !!response.data.user);
      userCache = response.data.user;
      cacheTimestamp = Date.now();
      saveCache(userCache, cacheTimestamp);
      pendingUserPromise = null;
      notifySubscribers(userCache);
      return userCache;
    })
    .catch(async error => {
      console.log('/auth/me 응답 실패:', error.response?.status);
      pendingUserPromise = null;
      
      if (error.response?.status === 401) {
        console.log('401 에러, 토큰 갱신 시도');
        // 토큰 갱신 시도
        const refreshed = await refreshAuthToken();
        console.log('토큰 갱신 결과:', refreshed);
        if (refreshed) {
          return userCache;
        }
      }
      
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

// 동기식 인증 확인 함수 (쿠키 기반으로 변경)
export const isAuthenticatedSync = () => {
  return !!userCache; // localStorage 참조 제거
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
  // URL에서 토큰 파라미터 확인 (OAuth 콜백)
  extractTokensFromUrl();
  
  // 페이지 로드 시 한 번 실행
  // checkAuth();
  
  // 탭 활성화될 때마다 캐시 유효성 확인
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !isCacheValid()) {
      checkAuth();
    }
  });
}