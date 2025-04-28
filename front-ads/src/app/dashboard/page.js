'use client';

import { useRouter } from 'next/navigation';
// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // 인증된 사용자만 접근 가능한 대시보드 내용
  return (
    <div className="container mx-auto p-4  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Salon Card */}
        <Card className="dark:bg-gray-700 dark:shadow-md dark:shadow-black/20 dark:rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">내 미용실</CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">내 미용실과 지점 정보를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-gray-500 dark:text-gray-400">운영중인 미용실</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="hover:bg-gray-500"
            onClick={() => router.push('/salons')}>
              내 미용실 보기</Button>
          </CardFooter>
        </Card>
        
        {/* Advertisements Card */}
        <Card className="dark:bg-gray-700 dark:shadow-md dark:shadow-black/20 dark:rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">광고 관리</CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">광고 캠페인을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-gray-500 dark:text-gray-400">진행중인 광고</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button
              className="hover:bg-gray-500"
              onClick={() => router.push('/ads')}
            >
              광고 보기
            </Button>
          </CardFooter>
        </Card>

        
        {/* Subscription Card */}
        <Card className="dark:bg-gray-700 dark:shadow-md dark:shadow-black/20 dark:rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">구독 관리</CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">구독 상품을 확인하고 변경하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-500 dark:font-bold dark:text-gray-400 dark:text-white">현재 구독중인 플랜:</p>
            <p className="text-2xl font-medium">없음</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="hover:bg-gray-500"
            onClick={() => router.push('/subscriptions')}>구독 설정</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}