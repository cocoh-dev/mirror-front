// hooks/useAuthCheck.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { checkAuth } from '@/services/authService';
import { toast } from 'sonner';

export function useAuthCheck(redirectPath = '/auth/login', message = '로그인이 필요한 페이지입니다.') {
  const router = useRouter();
  const { user, loading, initialized } = useAuth();
  const [authState, setAuthState] = useState({
    checked: false,
    verifiedUser: null,
    isLoading: true
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 먼저 useAuth에서 제공하는 user 확인
        if (user) {
          setAuthState({
            checked: true,
            verifiedUser: user,
            isLoading: false
          });
          return;
        }

        // 직접 백엔드 API 호출로 인증 상태 확인
        const currentUser = await checkAuth();
        
        if (currentUser) {
          setAuthState({
            checked: true,
            verifiedUser: currentUser,
            isLoading: false
          });
        } else {
          setAuthState({
            checked: true,
            verifiedUser: null,
            isLoading: false
          });
          
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirect_message', message);
          }
          router.push(redirectPath);
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        setAuthState({
          checked: true,
          verifiedUser: null,
          isLoading: false
        });
      }
    };

    if (initialized && !loading && !authState.checked) {
      verifyAuth();
    }
  }, [user, loading, initialized, authState.checked, router, redirectPath, message]);

  // 메시지 처리
  useEffect(() => {
    if (authState.verifiedUser && typeof window !== 'undefined') {
      const message = sessionStorage.getItem('redirect_message');
      if (message) {
        toast.error(message);
        sessionStorage.removeItem('redirect_message');
      }
    }
  }, [authState.verifiedUser]);

  return {
    isAuthenticated: !!authState.verifiedUser,
    user: authState.verifiedUser,
    isLoading: authState.isLoading || loading || !initialized || !authState.checked
  };
}