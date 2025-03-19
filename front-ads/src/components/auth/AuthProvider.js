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
      // 초기 캐시된 사용자 정보로 상태 설정 (빠른 UI 렌더링)
      const cachedUser = getCurrentUserSync();
      
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
      } else {
        // 캐시가 없으면, 서버에서 사용자 정보 가져오기
        // console.log('캐시된 사용자 정보 없음, 서버에서 가져오기 시도');
        const currentUser = await checkAuthStatus();
        if (currentUser) {
          setUser(currentUser);
        }
        setLoading(false);
      }
      
      setInitialized(true);
    };
    
    // 인증 상태 변경 구독
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    initAuth();
    
    // 페이지 가시성 변경 시 인증 확인 (탭 다시 활성화 등)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };
    
    // 네트워크 연결 복구 시 인증 확인
    const handleOnline = () => {
      checkAuthStatus();
    };
    
    // 사용자 활동 감지 (클릭, 키보드 입력 등)
    const handleUserActivity = () => {
      // 마지막 인증 확인 이후 충분한 시간이 지났는지 확인하는 로직 추가 가능
      // 여기서는 단순화를 위해 생략
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    // 추가적인 사용자 활동 이벤트 (필요시 활성화)
    // document.addEventListener('click', handleUserActivity);
    // document.addEventListener('keydown', handleUserActivity);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      // document.removeEventListener('click', handleUserActivity);
      // document.removeEventListener('keydown', handleUserActivity);
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