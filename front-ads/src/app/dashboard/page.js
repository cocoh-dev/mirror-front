// app/dashboard/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // 로딩이 완료된 후 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  }

  // 사용자가 없으면 렌더링하지 않음 (리다이렉트 대기)
  if (!user) {
    return null;
  }

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