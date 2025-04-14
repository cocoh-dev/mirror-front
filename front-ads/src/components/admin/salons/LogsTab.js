// /components/admin/salons/LogsTab.js
import { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { getSalonActivities } from '@/services/activityService';

export const LogsTab = ({ salonId }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getSalonActivities(salonId);
        setActivities(data.activities || []);
      } catch (error) {
        console.error('활동 로그 조회 실패:', error);
        setError(error.message || '활동 로그를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [salonId]);

  // 활동 유형에 따른 타이틀 생성
  const getActivityTitle = (activity) => {
    const typeMapping = {
      'salon_create': '미용실 등록',
      'salon_update': '미용실 정보 수정',
      'salon_delete': '미용실 삭제',
      'salon_status_update': '상태 변경',
      'salon_subscription_change': '구독 변경',
      'salon_owner_change': '대표자 변경',
      'salon_staff_add': '스태프 추가',
      'salon_staff_remove': '스태프 제거',
      'salon_service_update': '서비스 정보 업데이트',
      'salon_login': '미용실 계정 로그인',
      'salon_logout': '미용실 계정 로그아웃',
      'display_added': '디스플레이 추가',
      'display_updated': '디스플레이 업데이트',
      'display_removed': '디스플레이 제거',
    };
    
    return typeMapping[activity.activity_type] || activity.activity_type;
  };

  // 활동 내용 생성
  const getActivityDescription = (activity) => {
    const userName = activity.user?.name || 'Unknown';
    const userEmail = activity.user?.email || 'unknown@email.com';
    
    switch(activity.activity_type) {
      case 'salon_create':
        return `${userName} (${userEmail})님이 미용실을 등록했습니다.`;
      case 'salon_update':
        return `${userName} (${userEmail})님이 미용실 정보를 수정했습니다.`;
      case 'salon_status_change':
        const fromStatus = activity.details?.from_status || '이전 상태';
        const toStatus = activity.details?.to_status || '새 상태';
        return `미용실 상태가 '${fromStatus}'에서 '${toStatus}'으로 변경되었습니다.`;
      case 'salon_subscription_change':
        const fromType = activity.details?.from_type || '이전 구독';
        const toType = activity.details?.to_type || '새 구독';
        return `구독 유형이 '${fromType}'에서 '${toType}'으로 변경되었습니다.`;
      default:
        return `${userName} (${userEmail})님이 작업을 수행했습니다.`;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    } catch (e) {
      return dateString || '날짜 정보 없음';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>활동 로그</CardTitle>
          <CardDescription>미용실 계정 활동 기록을 불러오는 중...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-1/3"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>활동 로그</CardTitle>
          <CardDescription>미용실 계정 활동 기록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 p-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>활동 로그</CardTitle>
        <CardDescription>미용실 계정 활동 기록입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <History className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{getActivityTitle(activity)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(activity.created_at)}</p>
                  <p className="text-sm">{getActivityDescription(activity)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              활동 기록이 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTab;