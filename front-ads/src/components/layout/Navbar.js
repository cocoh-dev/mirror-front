'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

// Import shadcn components
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout, initialized, refreshToken } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // refreshToken 호출 로직을 useCallback으로 분리
  const handleTokenRefresh = useCallback(async () => {
    if (isRefreshing || loading || !initialized || user) return;
    
    setIsRefreshing(true);
    try {
      console.log('사용자 정보 없음, 리프레시 토큰 시도');
      await refreshToken();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loading, initialized, user, refreshToken]);
  
  // 초기 마운트 시 한 번만 실행
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 토큰 갱신 로직을 별도 useEffect로 분리
  useEffect(() => {
    // 로그인 페이지에서는 실행하지 않음
    if (!pathname?.startsWith('/auth/') && isMounted && !user && !loading && initialized && !isRefreshing) {
      handleTokenRefresh();
    }
  }, [pathname, isMounted, user, loading, initialized, isRefreshing, handleTokenRefresh]);

  // Only render on client side to avoid hydration mismatch
  if (!isMounted) return null;

  // If on auth pages, don't show navbar
  if (pathname?.startsWith('/auth/')) return null;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">미러모션</span>
            </Link>
            
            <nav className="ml-10 space-x-4">
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                대시보드
              </Link>
              
              <Link 
                href="/salons" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname?.startsWith('/salons') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                미용실
              </Link>
              
              <Link 
                href="/ads" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname?.startsWith('/ads') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                광고
              </Link>
              
              {user?.role === 'admin' || user?.role === 'superadmin' ? (
                <Link 
                  href="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname?.startsWith('/admin') 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  관리
                </Link>
              ) : null}
            </nav>
          </div>
          
          {/* User dropdown or login/register buttons */}
          <div className="flex items-center">
            {loading ? (
              <div className="flex items-center gap-2">
                {/* 로딩 인디케이터를 표시할 수 있습니다 */}
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user?.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">프로필</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscriptions">구독</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">로그인</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}