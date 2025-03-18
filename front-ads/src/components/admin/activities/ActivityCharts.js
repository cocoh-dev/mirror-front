// /components/admin/activities/ActivityCharts.js
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 차트 색상 설정
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#54C571', '#FFA07A', '#C7A317'];

// 활동 유형 설명
const getActivityTypeDescription = (type) => {
  const descriptions = {
    user_login: '로그인',
    user_logout: '로그아웃',
    user_register: '회원가입',
    user_profile_update: '프로필 업데이트',
    user_password_change: '비밀번호 변경',
    salon_create: '미용실 등록',
    salon_update: '미용실 정보 수정',
    salon_delete: '미용실 삭제',
    ad_create: '광고 생성',
    ad_update: '광고 수정',
    ad_delete: '광고 삭제',
    payment_created: '결제 시작',
    payment_completed: '결제 완료',
    payment_failed: '결제 실패',
    refund_requested: '환불 요청',
    refund_completed: '환불 완료',
    subscription_created: '구독 시작',
    subscription_renewed: '구독 갱신',
    subscription_cancelled: '구독 취소',
    subscription_expired: '구독 만료',
    display_added: '디스플레이 추가',
    display_updated: '디스플레이 업데이트',
    display_removed: '디스플레이 제거',
    admin_login: '관리자 로그인',
    admin_user_update: '사용자 정보 관리자 수정',
    admin_salon_update: '미용실 정보 관리자 수정'
  };
  
  return descriptions[type] || type;
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 커스텀 PieChart 툴팁
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].color }}>
          활동 수: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const ActivityCharts = ({ stats }) => {
  const [chartPeriod, setChartPeriod] = useState('30'); // 기본값: 30일
  
  if (!stats) {
    return (
      <div className="text-center py-10">
        <p>활동 통계를 불러오는데 실패했습니다.</p>
      </div>
    );
  }
  
  // 활동 유형별 데이터 형식 변환
  const typeData = stats.activityByType.map((item, index) => ({
    name: getActivityTypeDescription(item.activity_type),
    value: parseInt(item.count),
    color: COLORS[index % COLORS.length],
    originalType: item.activity_type
  }));
  
  // 일별 활동 데이터 형식 변환
  const dailyData = stats.dailyActivity.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    count: parseInt(item.count)
  }));
  
  // 가장 활동적인 사용자 데이터 형식 변환
  const userData = stats.mostActiveUsers.map((item, index) => ({
    name: item.user?.name || '알 수 없음',
    value: parseInt(item.count),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">활동 분석</h2>
        <Select
          value={chartPeriod}
          onValueChange={setChartPeriod}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="기간 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">최근 7일</SelectItem>
            <SelectItem value="14">최근 14일</SelectItem>
            <SelectItem value="30">최근 30일</SelectItem>
            <SelectItem value="90">최근 90일</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 일별 활동 추이 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>일별 활동 추이</CardTitle>
            <CardDescription>기간별 사용자 활동 수 변화</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="활동 수"
                    stroke="#0088FE"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 활동 유형별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>활동 유형별 분포</CardTitle>
            <CardDescription>가장 많이 발생한 활동 유형</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 활동적인 사용자 */}
        <Card>
          <CardHeader>
            <CardTitle>가장 활동적인 사용자</CardTitle>
            <CardDescription>활동 기록이 가장 많은 사용자</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="활동 수">
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 활동 유형별 통계 (상위 10개) */}
      <Card>
        <CardHeader>
          <CardTitle>활동 유형별 상세 통계</CardTitle>
          <CardDescription>상위 10개 활동 유형</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typeData.slice(0, 10).map((typeStat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{typeStat.name}</span>
                  <span>{typeStat.value}회</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${(typeStat.value / typeData[0].value) * 100}%`,
                      backgroundColor: typeStat.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};