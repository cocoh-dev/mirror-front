'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Download, 
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 날짜별 더미 데이터 생성 (지난 30일)
const generateDailyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dateString = `${date.getMonth() + 1}/${date.getDate()}`;
    const impressions = Math.floor(10000 + Math.random() * 5000);
    const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.04));
    const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.15));
    
    data.push({
      date: dateString,
      노출수: impressions,
      클릭수: clicks,
      전환수: conversions,
      CTR: parseFloat(((clicks / impressions) * 100).toFixed(2)),
      CVR: parseFloat(((conversions / clicks) * 100).toFixed(2))
    });
  }
  
  return data;
};

// 시간대별 더미 데이터 생성
const generateHourlyData = () => {
  const data = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const hourString = `${hour}:00`;
    const baseValue = hour >= 8 && hour <= 22 
      ? 500 + Math.random() * 1000  // 높은 트래픽 시간대
      : 100 + Math.random() * 300;  // 낮은 트래픽 시간대
    
    data.push({
      hour: hourString,
      노출수: Math.floor(baseValue),
      클릭수: Math.floor(baseValue * (0.01 + Math.random() * 0.04)),
      // 피크 시간대에 더 높은 CTR
      CTR: parseFloat((((0.01 + Math.random() * 0.04) + 
            (hour >= 18 && hour <= 22 ? 0.01 : 0)) * 100).toFixed(2))
    });
  }
  
  return data;
};

// 주간 트렌드 데이터 생성
const generateWeeklyData = () => {
  const weeks = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek - (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    
    weeks.push({
      week: weekLabel,
      노출수: Math.floor(80000 + Math.random() * 40000),
      클릭수: Math.floor(2000 + Math.random() * 2000),
      전환수: Math.floor(100 + Math.random() * 150),
    });
  }
  
  return weeks;
};

// 광고 ID별 성과 데이터
const generateAdPerformanceData = () => {
  const adTypes = ["배너", "팝업", "동영상", "네이티브"];
  const adData = [];
  
  for (let i = 1; i <= 20; i++) {
    const impressions = Math.floor(5000 + Math.random() * 25000);
    const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
    const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.2));
    const ctr = (clicks / impressions) * 100;
    const cvr = (conversions / clicks) * 100;
    
    adData.push({
      id: `AD-${10000 + i}`,
      name: `${adTypes[i % 4]} 광고 ${i}`,
      type: adTypes[i % 4],
      impressions,
      clicks,
      conversions,
      ctr: ctr.toFixed(2),
      cvr: cvr.toFixed(2),
      cost: Math.floor(50000 + Math.random() * 300000),
      roi: ((conversions * 15000) / (50000 + Math.random() * 300000) * 100).toFixed(2)
    });
  }
  
  // 노출수 기준 내림차순 정렬
  return adData.sort((a, b) => b.impressions - a.impressions);
};

// 요일별 평균 퍼포먼스 데이터
const generateDayOfWeekData = () => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return days.map(day => {
    // 주말에는 평균적으로 더 높은 노출수와 클릭수
    const isWeekend = day === "토" || day === "일";
    const baseImpressions = isWeekend ? 18000 : 15000;
    const impressions = Math.floor(baseImpressions + Math.random() * 5000);
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
    
    return {
      day,
      노출수: impressions,
      클릭수: clicks,
      CTR: parseFloat(((clicks / impressions) * 100).toFixed(2))
    };
  });
};

// 메인 대시보드 컴포넌트
const AdExposureDashboard = () => {
  const [dateRange, setDateRange] = useState('30일');
  const [timeFrame, setTimeFrame] = useState('일별');
  
  const dailyData = generateDailyData();
  const hourlyData = generateHourlyData();
  const weeklyData = generateWeeklyData();
  const adPerformanceData = generateAdPerformanceData();
  const dayOfWeekData = generateDayOfWeekData();

  // 날짜 범위에 따른 데이터 필터링
  const getFilteredData = () => {
    switch(timeFrame) {
      case '시간별':
        return hourlyData;
      case '주간':
        return weeklyData;
      case '일별':
      default:
        return dailyData;
    }
  };
  
  const filteredData = getFilteredData();
  
  // 요약 지표 계산
  const totalImpressions = filteredData.reduce((sum, item) => sum + item.노출수, 0);
  const totalClicks = filteredData.reduce((sum, item) => sum + (item.클릭수 || 0), 0);
  const totalConversions = timeFrame !== '시간별' 
    ? filteredData.reduce((sum, item) => sum + (item.전환수 || 0), 0)
    : "N/A";
  
  const averageCTR = (totalClicks / totalImpressions * 100).toFixed(2);
  const averageCVR = timeFrame !== '시간별' && totalConversions !== "N/A"
    ? ((totalConversions / totalClicks) * 100).toFixed(2)
    : "N/A";
  
  // 이전 기간 대비 증감율(더미 데이터)
  const impressionChange = (Math.random() * 30 - 10).toFixed(1);
  const clickChange = (Math.random() * 40 - 15).toFixed(1);
  const conversionChange = (Math.random() * 50 - 20).toFixed(1);
  
  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">광고 노출 시간 대시보드</h1>
          <p className="text-muted-foreground">
            광고 성과와 시간대별 노출 패턴 분석
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7일">최근 7일</SelectItem>
              <SelectItem value="30일">최근 30일</SelectItem>
              <SelectItem value="90일">최근 90일</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            리포트 다운로드
          </Button>
        </div>
      </div>
      
      {/* 요약 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 노출수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${impressionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {impressionChange > 0 ? (
                  <ArrowUpRight className="h-3 w-3 inline mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 inline mr-1" />
                )}
                {Math.abs(impressionChange)}% 
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                (이전 {dateRange} 대비)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 클릭수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${clickChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {clickChange > 0 ? (
                  <ArrowUpRight className="h-3 w-3 inline mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 inline mr-1" />
                )}
                {Math.abs(clickChange)}% 
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                (이전 {dateRange} 대비)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCTR}%</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">
                업계 평균: 2.35%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 전환수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalConversions === "N/A" ? "N/A" : totalConversions.toLocaleString()}
            </div>
            {totalConversions !== "N/A" && (
              <div className="flex items-center mt-1">
                <span className={`text-xs ${conversionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {conversionChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 inline mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 inline mr-1" />
                  )}
                  {Math.abs(conversionChange)}% 
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  (이전 {dateRange} 대비)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>시간대별 광고 성과</CardTitle>
              <div className="flex space-x-2">
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger className="w-32">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="시간 단위" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="시간별">시간별</SelectItem>
                    <SelectItem value="일별">일별</SelectItem>
                    <SelectItem value="주간">주간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={timeFrame === '시간별' ? 'hour' : timeFrame === '주간' ? 'week' : 'date'} 
                    style={{ fontSize: '0.8rem' }}
                  />
                  <YAxis yAxisId="left" orientation="left" style={{ fontSize: '0.8rem' }} />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    domain={[0, 10]} 
                    style={{ fontSize: '0.8rem' }} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value, name) => [name === 'CTR' ? `${value}%` : value.toLocaleString(), name]} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="노출수" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="클릭수" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="CTR" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 추가 차트 및 테이블 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 요일별 평균 성과 */}
        <Card>
          <CardHeader>
            <CardTitle>요일별 평균 성과</CardTitle>
            <CardDescription>평일 vs 주말 성과 비교</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dayOfWeekData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value, name) => [name === 'CTR' ? `${value}%` : value.toLocaleString(), name]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="노출수" fill="#8884d8" barSize={20} />
                  <Bar yAxisId="left" dataKey="클릭수" fill="#82ca9d" barSize={20} />
                  <Line yAxisId="right" type="monotone" dataKey="CTR" stroke="#ff7300" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* 시간대별 트래픽 패턴 */}
        <Card>
          <CardHeader>
            <CardTitle>시간대별 트래픽 패턴</CardTitle>
            <CardDescription>24시간 트래픽 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(value) => value.split(':')[0]} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                  <Bar dataKey="노출수" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 광고 성과 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>광고별 성과</CardTitle>
          <CardDescription>노출수 기준 상위 광고</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>광고 ID</TableHead>
                <TableHead>광고명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead className="text-right">노출수</TableHead>
                <TableHead className="text-right">클릭수</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">전환수</TableHead>
                <TableHead className="text-right">CVR</TableHead>
                <TableHead className="text-right">비용</TableHead>
                <TableHead className="text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adPerformanceData.slice(0, 10).map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.id}</TableCell>
                  <TableCell>{ad.name}</TableCell>
                  <TableCell>{ad.type}</TableCell>
                  <TableCell className="text-right">{ad.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{ad.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{ad.ctr}%</TableCell>
                  <TableCell className="text-right">{ad.conversions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{ad.cvr}%</TableCell>
                  <TableCell className="text-right">₩{ad.cost.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${parseFloat(ad.roi) > 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {ad.roi}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdExposureDashboard;