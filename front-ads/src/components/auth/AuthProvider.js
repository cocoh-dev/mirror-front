// File: front-ads/src/components/auth/AuthProvider.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUserSync, 
  subscribeToAuthChanges,
  logout as authLogout,
  login as authLogin,
  checkAuth,
  refreshAuthToken
} from '@/services/authService';

// 컨텍스트 생성
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // 인증 상태 확인 및 필요시 토큰 갱신
  const checkAuthStatus = async () => {
    try {
      // checkAuth 함수는 필요시 토큰을 갱신하고 사용자 정보를 반환
      const userData = await checkAuth();
      return userData;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const initAuth = async () => {
      // console.log('AuthProvider initAuth 시작');
      // 초기 캐시된 사용자 정보로 상태 설정 (빠른 UI 렌더링)
      const cachedUser = getCurrentUserSync();
      
      if (cachedUser) {
        // console.log('캐시된, 사용자 정보 있음');
        setUser(cachedUser);
        setLoading(false);
      } else {
        // console.log('캐시된 사용자 정보 없음, 서버에서 확인 시도');
        setLoading(true); // 로딩 상태 명시적 설정
        try {
          const currentUser = await checkAuth();
          // console.log('checkAuth 결과:', !!currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error('Auth 초기화 오류:', error);
        } finally {
          setLoading(false); 
        }
      }
      
      setInitialized(true);
    };
    
    // 초기화 실행
    initAuth();
    
    // 페이지 가시성 변경 시 인증 확인 - 쿨다운 로직 추가
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastVisibilityCheck = localStorage.getItem('lastVisibilityCheck');
        const visibilityCooldown = 30000; // 30초
        
        if (!lastVisibilityCheck || Date.now() - parseInt(lastVisibilityCheck) > visibilityCooldown) {
          localStorage.setItem('lastVisibilityCheck', Date.now().toString());
          checkAuthStatus();
        }
      }
    };
    
    // 네트워크 연결 복구 시 인증 확인 - 쿨다운 로직 추가
    const handleOnline = () => {
      const lastOnlineCheck = localStorage.getItem('lastOnlineCheck');
      const onlineCooldown = 10000; // 10초
      
      if (!lastOnlineCheck || Date.now() - parseInt(lastOnlineCheck) > onlineCooldown) {
        localStorage.setItem('lastOnlineCheck', Date.now().toString());
        checkAuthStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // 로그인 함수
  const login = async (credentials) => {
    setLoading(true);
    try {
      return await authLogin(credentials);
    } finally {
      setLoading(false);
    }
  };
  
  // 로그아웃 함수
  const logout = () => {
    setLoading(true);
    authLogout();
  };
  
  // 토큰 갱신 함수 - 필요시 직접 호출 가능
  const refreshToken = async () => {
    try {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // 토큰 갱신 성공 후 사용자 정보 다시 로드
        const userData = await checkAuth();
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };
  
  // 사용자 정보를 직접 갱신하는 함수 추가
  const refreshUser = (userData) => {
    setUser(userData);
  };
  
  // 인증 컨텍스트 값
  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
    refreshToken,
    refreshUser, // 사용자 정보 갱신 함수 추가
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 인증 상태를 사용하기 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};