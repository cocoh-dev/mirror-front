// src/components/layout/Navbar.js (수정안)
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle'; // 테마 토글 컴포넌트 import

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
import { Menu, X } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout, initialized, refreshToken } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // refreshToken 호출 로직 및 기존 useEffect 코드는 그대로 유지...
  const handleTokenRefresh = useCallback(async () => {
    if (isRefreshing || loading || !initialized || user) return;
    
    const lastNavbarRefresh = localStorage.getItem('lastNavbarRefresh');
    const navbarRefreshCooldown = 10000; // 10초
    
    if (lastNavbarRefresh && Date.now() - parseInt(lastNavbarRefresh) < navbarRefreshCooldown) {
      return;
    }
    
    setIsRefreshing(true);
    localStorage.setItem('lastNavbarRefresh', Date.now().toString());
    
    try {
      await refreshToken();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loading, initialized, user, refreshToken]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!pathname?.startsWith('/auth/') && isMounted && !user && !loading && initialized && !isRefreshing) {
      handleTokenRefresh();
    }
  }, [pathname, isMounted, user, loading, initialized, isRefreshing, handleTokenRefresh]);

  const NavItems = () => (
    <>
      <Link 
        href="/dashboard" 
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname === '/dashboard' 
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        }`}
        onClick={() => setIsOpen(false)}
      >
        대시보드
      </Link>
      
      <Link 
        href="/salons" 
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname?.startsWith('/salons') 
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        }`}
        onClick={() => setIsOpen(false)}
      >
        미용실
      </Link>
      
      <Link 
        href="/ads" 
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname?.startsWith('/ads') 
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        }`}
        onClick={() => setIsOpen(false)}
      >
        광고
      </Link>
      
      {user?.role === 'admin' || user?.role === 'superadmin' ? (
        <Link 
          href="/admin" 
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname?.startsWith('/admin') 
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
          }`}
          onClick={() => setIsOpen(false)}
        >
          관리
        </Link>
      ) : null}
    </>
  );

  if (!isMounted) return null;
  if (pathname?.startsWith('/auth/')) return null;
  
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: Left - Menu Button, Center - Logo */}
          <div className="md:hidden flex w-full items-center justify-between">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-6 w-6 dark:text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="dark:bg-gray-900 dark:text-gray-100">
                <SheetHeader>
                  <SheetTitle className="dark:text-gray-100">메뉴</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 px-6">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>

            {/* Centered Logo on Mobile */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold dark:text-white">미러모션</span>
              </Link>
            </div>

            {/* Empty div to balance the layout */}
            <div className="w-10"></div>
          </div>
          
          {/* Desktop: Left - Logo and Navigation */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold dark:text-white">미러모션</span>
            </Link>
            
            <nav className="ml-10 space-x-4 flex">
              <NavItems />
            </nav>
          </div>
          
          {/* User dropdown or login/register buttons - Always on right */}
          <div className="hidden md:flex items-center space-x-2">
            {/* 테마 토글 버튼 추가 */}
            <ThemeToggle />
            
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin dark:border-gray-600 dark:border-t-blue-400"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {user?.profileImage ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(user.profileImage)}`} 
                        alt={`${user?.name || 'User'}'s profile`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="dark:text-gray-200">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                    <span className="hidden sm:inline">{user?.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <DropdownMenuLabel className="dark:text-gray-300">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem asChild className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    <Link href="/profile">프로필</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    <Link href="/subscriptions">구독</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem onClick={logout} className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                  <Link href="/auth/login">로그인</Link>
                </Button>
                <Button asChild className="dark:hover:bg-blue-700">
                  <Link href="/auth/register">회원가입</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: User icon in top right */}
          <div className="md:hidden absolute right-4 flex items-center space-x-1">
            {/* 모바일에서도 테마 토글 버튼 추가 */}
            <ThemeToggle />
            
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin dark:border-gray-600 dark:border-t-blue-400"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {user?.profileImage ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(user.profileImage)}`} 
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="dark:text-gray-200">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <DropdownMenuLabel className="dark:text-gray-300">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem asChild className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    <Link href="/profile">프로필</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    <Link href="/subscriptions">구독</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem onClick={logout} className="dark:focus:bg-gray-700 dark:focus:text-gray-100">
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" asChild className="dark:hover:bg-blue-700">
                <Link href="/auth/login">로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}