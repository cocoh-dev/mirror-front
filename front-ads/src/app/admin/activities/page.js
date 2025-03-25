// /admin/activities/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Calendar, 
  Search, 
  Filter, 
  BarChart4, 
  Users, 
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { ActivityTable } from '@/components/admin/activities/ActivityTable';
import { ActivityFilters } from '@/components/admin/activities/ActivityFilters';
import { ActivityCharts } from '@/components/admin/activities/ActivityCharts';
import { TableSkeleton } from '@/components/admin/activities/SkeletonLoaders';

import { searchActivities, getActivityStats, generateWeeklyReport, getAllActivityTypes } from '@/services/activityService';

export default function ActivitiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState('list');
  const [searchParams, setSearchParams] = useState({
    userId: '',
    activityType: '',
    startDate: null,
    endDate: null,
    keyword: '',
  });
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });

  // 활동 유형 목록 가져오기
  const { 
    data: activityTypes,
    isLoading: typesLoading
  } = useQuery({
    queryKey: ['activityTypes'],
    queryFn: getAllActivityTypes
  });

  // 활동 데이터 가져오기
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isError: activitiesError,
    error: activitiesErrorData
  } = useQuery({
    queryKey: ['activities', currentPage, itemsPerPage, searchParams],
    queryFn: () => searchActivities({
      page: currentPage,
      limit: itemsPerPage,
      userId: searchParams.userId,
      activityType: searchParams.activityType,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      keyword: searchParams.keyword
    }),
    keepPreviousData: true
  });

  // 활동 통계 가져오기
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['activityStats', dateRange],
    queryFn: () => getActivityStats(dateRange.from ? Math.floor((new Date() - dateRange.from) / (1000 * 60 * 60 * 24)) : 30),
    enabled: activeTab === 'stats'
  });

  // 주간 리포트 가져오기
  const {
    data: reportData,
    isLoading: reportLoading,
    refetch: refetchReport
  } = useQuery({
    queryKey: ['weeklyReport'],
    queryFn: generateWeeklyReport,
    enabled: activeTab === 'report'
  });

  // 필터 변경 핸들러
  const handleSearchChange = (value) => {
    setSearchParams(prev => ({ ...prev, keyword: value }));
    setCurrentPage(1);
  };

  const handleUserFilterChange = (userId) => {
    setSearchParams(prev => ({ ...prev, userId }));
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (activityType) => {
    setSearchParams(prev => ({ ...prev, activityType }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    if (range.from && range.to) {
      setSearchParams(prev => ({
        ...prev,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString()
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        startDate: null,
        endDate: null
      }));
    }
    
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchParams({
      userId: '',
      activityType: '',
      startDate: null,
      endDate: null,
      keyword: '',
    });
    setDateRange({ from: null, to: null });
    setCurrentPage(1);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    
    if (value === 'stats') {
      refetchStats();
    } else if (value === 'report') {
      refetchReport();
    }
  };

  const handleExportCSV = () => {
    // CSV 내보내기 구현 (서비스 함수 필요)
    toast.info('CSV 내보내기 기능은 개발 중입니다.');
  };

  // 데이터 추출
  const activities = activitiesData?.activities || [];
  const pagination = activitiesData?.pagination || { 
    total: 0, 
    page: 1,
    totalPages: 1 
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">사용자 활동 로그</h1>
          <p className="text-muted-foreground">사용자 행동을 추적하고 분석합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>CSV 내보내기</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>활동 목록</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>활동 통계</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>주간 리포트</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>활동 로그 검색</CardTitle>
              <CardDescription>
                특정 사용자, 활동 유형, 또는 날짜별로 활동을 필터링하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="활동 내용 검색..."
                      value={searchParams.keyword}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex flex-row gap-2">
                  <Select
                    value={searchParams.activityType}
                    onValueChange={handleTypeFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="모든 활동 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem>모든 활동 유형</SelectItem>
                      {activityTypes?.types?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <DatePickerWithRange 
                    onChange={handleDateRangeChange}
                    value={dateRange}
                  />
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleClearFilters}
                    size="icon"
                    title="필터 초기화"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {activitiesLoading ? (
            <TableSkeleton />
          ) : activitiesError ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <p className="text-destructive text-lg">데이터를 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-muted-foreground">{activitiesErrorData?.message}</p>
              <Button onClick={() => queryClient.invalidateQueries(['activities'])}>
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <ActivityTable 
                activities={activities}
                onUserClick={handleUserFilterChange}
                onTypeClick={handleTypeFilterChange}
              />

              {/* 페이지네이션 */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  총 {pagination.total}개의 활동 중 {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, pagination.total)}개 표시
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || activitiesLoading}
                  >
                    이전
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage >= pagination.totalPages || activitiesLoading}
                  >
                    다음
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="stats">
          {statsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ActivityCharts stats={statsData?.stats} />
          )}
        </TabsContent>

        <TabsContent value="report">
          {reportLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>주간 활동 요약</CardTitle>
                  <CardDescription>
                    {reportData?.report.period.start && new Date(reportData.report.period.start).toLocaleDateString()} - 
                    {reportData?.report.period.end && new Date(reportData.report.period.end).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">총 활동 수</h3>
                      <p className="text-2xl font-bold">{reportData?.report.activityChange.currentWeek}</p>
                      <div className={`flex items-center text-sm ${
                        parseFloat(reportData?.report.activityChange.changePercentage) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        <span>
                          {reportData?.report.activityChange.changePercentage}% 
                          {parseFloat(reportData?.report.activityChange.changePercentage) >= 0 ? '증가' : '감소'}
                        </span>
                        <span className="text-gray-500 ml-1">(전주 대비)</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">가장 활동적인 사용자</h3>
                      <div className="space-y-2 mt-2">
                        {reportData?.report.topUsers.map((userStat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                                {index + 1}
                              </div>
                              <span>{userStat.user?.name || '알 수 없음'}</span>
                            </div>
                            <span className="font-medium">{userStat.count}회</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>활동 유형 분석</CardTitle>
                  <CardDescription>가장 많이 발생한 활동 유형</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData?.report.activityByType.map((typeStat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{typeStat.activity_type}</span>
                          <span>{typeStat.count}회</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ 
                              width: `${(typeStat.count / reportData.report.activityByType[0].count) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}