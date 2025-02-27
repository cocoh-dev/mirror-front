// components/layout/Navbar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, loading, logout } = useAuth();

  // If on auth pages, don't show navbar
  if (pathname.startsWith('/auth/')) return null;

  // 로딩 중에는 스켈레톤 UI 또는 간단한 로딩 상태 표시
  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center">
              <span className="text-2xl font-bold">Mirror Motion</span>
            </div>
            {/* 로딩 상태 표시 */}
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Mirror Motion</span>
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
                Dashboard
              </Link>
              
              <Link 
                href="/salons" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/salons') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Salons
              </Link>
              
              <Link 
                href="/ads" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/ads') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Advertisements
              </Link>
              
              {user?.role === 'admin' || user?.role === 'superadmin' ? (
                <Link 
                  href="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/admin') 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>
          
          {/* User dropdown or login/register buttons */}
          <div className="flex items-center">
            {user ? (
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
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscriptions">Subscriptions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
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