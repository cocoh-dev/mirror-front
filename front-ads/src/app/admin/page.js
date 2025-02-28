// /admin/page.js
'use client';

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

export default function AdminDashboardPage() {
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
              <CardHeader>
                <CardTitle>월별 사용자 추이</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  차트 자리 (실제 데이터 연동 시 구현)
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  최근 10건의 사용자 활동
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          사용자가 구독을 업데이트했습니다.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          2분 전
                        </p>
                      </div>
                    </div>
                  ))}
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
}