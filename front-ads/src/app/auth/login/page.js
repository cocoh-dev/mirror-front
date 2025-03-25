'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, initialized } = useAuth();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const message = sessionStorage.getItem('redirect_message');
      if (message === 'login_required') {
        toast.error('로그인이 필요한 페이지입니다.');
        sessionStorage.removeItem('redirect_message');
      } else if (message === 'admin_access_denied') {
        toast.error('관리자 권한이 필요한 페이지입니다.');
        sessionStorage.removeItem('redirect_message');
      }
    }
  }, []);
  
  // 인증 상태 확인 후 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (initialized && !loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, initialized, router]);
  
  // 로딩 중이거나 리다이렉트 중일 때는 로그인 폼을 표시하지 않음
  if (loading || (initialized && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <p className="mt-2 text-gray-600">
              로딩 중...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">환영합니다.</h1>
          <p className="mt-2 text-gray-600">
            로그인하여 서비스를 이용해보세요
          </p>
        </div>
        
        <Suspense fallback={<div>Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}