'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Download, 
  Users, 
  Scissors,
  ShoppingBag
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 더미 데이터 생성
const generateMonthlyUserData = () => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  return months.map((month, index) => {
    const regularUsers = Math.floor(1500 + Math.random() * 500 + index * 70);
    const premiumUsers = Math.floor(500 + Math.random() * 200 + index * 30);
    const totalUsers = regularUsers + premiumUsers;
    
    return {
      name: month,
      일반사용자: regularUsers,
      프리미엄: premiumUsers,
      총사용자: totalUsers,
    };
  });
};

const generateRevenueData = () => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  return months.map((month) => {
    return {
      name: month,
      광고수익: Math.floor(2000000 + Math.random() * 3000000),
      구독수익: Math.floor(1500000 + Math.random() * 1500000),
    };
  });
};

// Overview 섹션의 카드 컴포넌트
const DashboardCard = ({ title, value, description, icon: Icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const RecentActivities = () => {
  const activities = [
    { id: 1, action: '신규 미용실 등록', time: '2분 전' },
    { id: 2, action: '사용자가 프로 구독으로 업그레이드', time: '15분 전' },
    { id: 3, action: '새로운 광고 캠페인 등록', time: '35분 전' },
    { id: 4, action: '미용실 정보 업데이트', time: '1시간 전' },
    { id: 5, action: '신규 사용자 가입', time: '2시간 전' },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.action}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeChart, setActiveChart] = useState('users');
  const userData = generateMonthlyUserData();
  const revenueData = generateRevenueData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            <span>리포트 다운로드</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analytics">통계</TabsTrigger>
          <TabsTrigger value="reports">리포트</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard 
              title="전체 회원"
              value="2,350"
              description="전월 대비 +2.1%"
              icon={Users}
            />
            <DashboardCard 
              title="미용실"
              value="452"
              description="전월 대비 +1.2%"
              icon={Scissors}
            />
            <DashboardCard 
              title="광고 수익"
              value="₩4,250,500"
              description="전월 대비 +18.1%"
              icon={CreditCard}
            />
            <DashboardCard 
              title="구독 수익"
              value="₩2,365,000"
              description="전월 대비 +10.3%"
              icon={DollarSign}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>월별 추이</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={activeChart === 'users' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('users')}
                    >
                      사용자
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activeChart === 'revenue' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('revenue')}
                    >
                      수익
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  {activeChart === 'users' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={userData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="일반사용자" stroke="#8884d8" />
                        <Line type="monotone" dataKey="프리미엄" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="총사용자" stroke="#ff7300" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => new Intl.NumberFormat('ko-KR', { 
                            style: 'currency', 
                            currency: 'KRW',
                            maximumFractionDigits: 0
                          }).format(value)}
                        />
                        <Legend />
                        <Bar dataKey="광고수익" fill="#8884d8" />
                        <Bar dataKey="구독수익" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  최근 활동 내역
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>미용실 지역별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: '서울', value: 180 },
                        { name: '경기', value: 120 },
                        { name: '부산', value: 60 },
                        { name: '인천', value: 45 },
                        { name: '기타', value: 47 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>구독 유형 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: '기본', value: 210 },
                        { name: '프로', value: 180 },
                        { name: '프리미엄', value: 62 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>광고 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: '1월', 노출: 1200, 클릭: 400 },
                        { name: '2월', 노출: 1500, 클릭: 500 },
                        { name: '3월', 노출: 2000, 클릭: 700 },
                        { name: '4월', 노출: 1800, 클릭: 600 },
                        { name: '5월', 노출: 2200, 클릭: 900 },
                        { name: '6월', 노출: 2500, 클릭: 1100 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="노출" stroke="#8884d8" />
                      <Line type="monotone" dataKey="클릭" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상세 통계</CardTitle>
              <CardDescription>
                사용자 및 서비스 분석 데이터
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              이 탭에는 상세 분석 데이터가 표시됩니다.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>리포트</CardTitle>
              <CardDescription>
                시스템 리포트 및 로그
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              이 탭에는 시스템 리포트 및 로그가 표시됩니다.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;