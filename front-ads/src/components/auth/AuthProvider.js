'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const authCheckIntervalRef = useRef(null); // 주기적 인증 확인용 interval 참조
  
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
      // 초기 캐시된 사용자 정보로 상태 설정 (빠른 UI 렌더링)
      const cachedUser = getCurrentUserSync();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
      }
      
      // 실제 서버에서 최신 인증 상태 확인
      const currentUser = await checkAuthStatus();
      if (currentUser) {
        setUser(currentUser);
      }
      
      setLoading(false);
      setInitialized(true);
    };
    
    // 인증 상태 변경 구독
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    initAuth();
    
    // 주기적으로 인증 상태 확인 (매 5분마다)
    // 실제 환경에 맞게 시간 조정 가능
    authCheckIntervalRef.current = setInterval(async () => {
      await checkAuthStatus();
    }, 5 * 60 * 1000); // 5분
    
    // 페이지 가시성 변경 시 인증 확인 (탭 다시 활성화 등)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      clearInterval(authCheckIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
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
  
  // 인증 컨텍스트 값
  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
    refreshToken, // 토큰 갱신 함수 추가
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