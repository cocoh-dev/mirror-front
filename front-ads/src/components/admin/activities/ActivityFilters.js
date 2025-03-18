// /components/admin/activities/ActivityFilters.js
import { Search, Filter, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

export const ActivityFilters = ({
  searchQuery,
  onSearchChange,
  activityType,
  activityTypes,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onClearFilters
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="활동 내용 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex flex-row gap-2">
          <Select
            value={activityType}
            onValueChange={onTypeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="모든 활동 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">모든 활동 유형</SelectItem>
              {activityTypes?.map((type) => (
                <SelectItem key={type} value={type}>
                  {getActivityTypeDescription(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DatePickerWithRange 
            onChange={onDateRangeChange}
            value={dateRange}
          />
          
          <Button 
            variant="ghost" 
            onClick={onClearFilters}
            size="icon"
            title="필터 초기화"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

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