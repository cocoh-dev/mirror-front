'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUserSync, 
  subscribeToAuthChanges,
  logout as authLogout,
  login as authLogin
} from '@/services/authService';

// 컨텍스트 생성
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    
    // 첫 로드 시 캐시된 사용자 정보가 있으면 사용
    const cachedUser = getCurrentUserSync();
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }
    
    // 인증 상태 변경 구독
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    setInitialized(true);
    
    return unsubscribe;
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
  
  // 인증 컨텍스트 값
  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
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