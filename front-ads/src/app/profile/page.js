'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, User2, UserCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ProfilePage() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">프로필</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>사용자 기본 정보</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.role === 'superadmin' ? '최고 관리자' : 
                    user.role === 'admin' ? '관리자' : 
                    user.role === 'salonOwner' ? '미용실 주인' : '일반 사용자'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User2 className="w-4 h-4" />
                  <span>로그인 제공자: {user.provider}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>마지막 로그인: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>권한 정보</CardTitle>
            <CardDescription>사용자 권한 및 접근 레벨</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">현재 권한</h4>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'salonOwner' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'superadmin' ? '최고 관리자' :
                  user.role === 'admin' ? '관리자' : 
                  user.role === 'salonOwner' ? '미용실 주인' : '일반 사용자'}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">접근 가능 기능</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>개인 정보 관리</li>
                  {user.role === 'salonOwner' && <li>미용실 정보 관리</li>}
                  {user.role !== 'user' && <li>광고 관리 {(user.role === 'admin' || user.role === 'superadmin') && '및 승인'}</li>}
                  <li>미용실 정보 조회</li>
                  {user.role === 'superadmin' && <li>사용자 권한 관리</li>}
                  {user.role !== 'user' && <li>통계 데이터 조회</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}