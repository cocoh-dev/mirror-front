'use client';

import { useRouter } from 'next/navigation';
// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthCheck();

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Salon Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Salons</CardTitle>
            <CardDescription>Manage your salons and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className="text-gray-500">Active Salons</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/salons')}>View Salons</Button>
          </CardFooter>
        </Card>
        
        {/* Advertisements Card */}
        <Card>
          <CardHeader>
            <CardTitle>Advertisements</CardTitle>
            <CardDescription>Manage your advertising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className="text-gray-500">Active Ads</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/ads')}>View Ads</Button>
          </CardFooter>
        </Card>
        
        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Current Plan:</p>
            <p className="text-xl font-medium">None</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/subscriptions')}>Manage Subscription</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}