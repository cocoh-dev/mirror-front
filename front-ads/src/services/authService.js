import api from '../lib/api';

// 사용자 정보 캐싱을 위한 변수
let userCache = null;
let pendingUserPromise = null;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5분 캐시
let cacheTimestamp = null;

// 토큰 갱신 중인지 추적하는 변수
let isRefreshing = false;

// 새로운 상태 구독 시스템
const subscribers = new Set();

// URL에서 토큰 추출 함수 수정 (이제 쿠키를 사용하므로 간소화)
export const extractTokensFromUrl = async () => {
  if (typeof window === 'undefined') return null;
  
  // OAuth 리다이렉트 확인 (state 파라미터 등 활용)
  const urlParams = new URLSearchParams(window.location.search);
  const hasOAuthParams = urlParams.has('state') || urlParams.has('code');
  
  if (hasOAuthParams) {
    console.log('OAuth 리다이렉트 감지');
    
    // URL 파라미터 제거 (보안)
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    // 사용자 정보 로드
    try {
      const user = await checkAuth();
      console.log('OAuth 로그인 성공 - 사용자 정보 로드됨:', user ? '성공' : '실패');
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
    throw error.response?.data || { message: 'Login failed' };
  }
};

// 토큰 갱신 명시적 함수
// 토큰 갱신 명시적 함수 - 개선된 버전
export const refreshAuthToken = async () => {
  // 이미 갱신 중이면 중복 요청 방지
  if (isRefreshing) {
    return new Promise(resolve => {
      const checkRefreshComplete = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(checkRefreshComplete);
          resolve(!!userCache); // 사용자 캐시가 있으면 성공, 없으면 실패
        }
      }, 100);
    });
  }
  
  // 브라우저 환경이 아니면 실패
  if (typeof document === 'undefined') return false;
  
  // 쿠키 확인 - refreshToken 쿠키가 없으면 갱신 시도하지 않음
  if (!document.cookie.includes('refreshToken')) {
    console.log('리프레시 토큰 쿠키가 없어 갱신을 시도하지 않습니다.');
    return false;
  }
  
  // 최근 실패 기록 확인 (연속적인 실패 방지)
  const lastRefreshFail = localStorage.getItem('lastRefreshFail');
  const failCooldown = 10000; // 10초 쿨다운
  
  if (lastRefreshFail && Date.now() - parseInt(lastRefreshFail) < failCooldown) {
    console.log('최근에 갱신 실패. 쿨다운 기간 동안 재시도하지 않습니다.');
    return false;
  }
  
  isRefreshing = true;
  
  try {
    // 토큰 갱신 요청
    const response = await api.post('/auth/refresh-token');
    
    // 갱신 성공 시 사용자 정보 업데이트
    userCache = response.data.user;
    cacheTimestamp = Date.now();
    notifySubscribers(userCache);
    
    // 실패 기록 제거
    localStorage.removeItem('lastRefreshFail');
    
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // 갱신 실패 시 (예: 리프레시 토큰 만료) 사용자 정보 초기화
    if (error.response?.status === 401) {
      invalidateCache();
      notifySubscribers(null);
    }
    
    // 실패 시간 기록 (연속적인 실패 방지)
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
// Logout function - 개선된 버전
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 캐시 초기화
    invalidateCache();
    
    // 로컬 스토리지 인증 관련 항목 제거
    localStorage.removeItem('lastRefreshFail');
    
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
  
  // 새 요청 실행 (withCredentials 설정으로 쿠키 자동 전송)
  pendingUserPromise = api.get('/auth/me')
    .then(response => {
      userCache = response.data.user;
      cacheTimestamp = Date.now();
      pendingUserPromise = null;
      notifySubscribers(userCache);
      return userCache;
    })
    .catch(async error => {
      pendingUserPromise = null;
      
      // 401 에러가 발생하고 자동 갱신을 시도할 경우
      if (error.response?.status === 401) {
        try {
          // 토큰 갱신 시도
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            // 갱신 성공 시 사용자 정보 다시 요청
            const response = await api.get('/auth/me');
            userCache = response.data.user;
            cacheTimestamp = Date.now();
            notifySubscribers(userCache);
            return userCache;
          }
        } catch (refreshError) {
          console.error('Token refresh in checkAuth failed:', refreshError);
        }
      }
      
      // 최종 실패 시 인증 상태 초기화
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
  checkAuth();
  
  // 탭 활성화될 때마다 캐시 유효성 확인
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !isCacheValid()) {
      checkAuth();
    }
  });
}