// contexts/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/services/authService';

// Context 생성
const AuthContext = createContext(undefined);

// Provider 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 갱신 함수
  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // 로컬 스토리지에 사용자 정보 저장
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 초기 로딩
  useEffect(() => {
    const initAuth = async () => {
      // 로컬 스토리지에서 사용자 정보 가져오기 (클라이언트 사이드에서만 실행)
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse stored user', e);
          }
        }
      }
      
      // API에서 최신 사용자 정보 가져오기
      await refreshUser();
      setLoading(false);
    };

    initAuth();
  }, []);

  // Context 값
  const value = {
    user,
    loading,
    refreshUser,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};