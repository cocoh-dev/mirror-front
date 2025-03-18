// /components/admin/activities/ActivityTable.js
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, User, Tag, Clock } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

// 활동 유형에 따른 뱃지 컬러 설정
const getActivityTypeBadgeColor = (type) => {
  const typeMappings = {
    user_login: 'bg-blue-100 text-blue-800',
    user_logout: 'bg-gray-100 text-gray-800',
    user_register: 'bg-green-100 text-green-800',
    user_profile_update: 'bg-yellow-100 text-yellow-800',
    salon_create: 'bg-purple-100 text-purple-800',
    salon_update: 'bg-indigo-100 text-indigo-800',
    salon_delete: 'bg-red-100 text-red-800',
    payment_created: 'bg-teal-100 text-teal-800',
    payment_completed: 'bg-emerald-100 text-emerald-800',
    payment_failed: 'bg-rose-100 text-rose-800',
    subscription_created: 'bg-amber-100 text-amber-800',
    subscription_renewed: 'bg-lime-100 text-lime-800',
    subscription_cancelled: 'bg-orange-100 text-orange-800',
  };
  
  return typeMappings[type] || 'bg-gray-100 text-gray-800';
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

// 활동 메시지 생성
const getActivityMessage = (activity) => {
  const username = activity.user?.name || '알 수 없음';
  const description = getActivityTypeDescription(activity.activity_type);
  
  return `${username}님이 ${description}했습니다.`;
};

export const ActivityTable = ({ activities, onUserClick, onTypeClick }) => {
  // 상세 정보 JSON을 예쁘게 표시하기 위한 함수
  const formatDetailsJson = (details) => {
    if (!details) return '-';
    
    try {
      return JSON.stringify(details, null, 2);
    } catch (e) {
      return String(details);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>활동 ID</TableHead>
              <TableHead>사용자</TableHead>
              <TableHead>활동 유형</TableHead>
              <TableHead>활동 내용</TableHead>
              <TableHead>IP 주소</TableHead>
              <TableHead>시간</TableHead>
              <TableHead className="text-right">상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  표시할 활동 기록이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 p-0 h-auto"
                      onClick={() => onUserClick(activity.user_id)}
                    >
                      <User className="h-3 w-3" />
                      {activity.user?.name || '알 수 없음'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 p-0 h-auto"
                      onClick={() => onTypeClick(activity.activity_type)}
                    >
                      <Tag className="h-3 w-3" />
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        getActivityTypeBadgeColor(activity.activity_type)
                      }`}>
                        {getActivityTypeDescription(activity.activity_type)}
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell>{getActivityMessage(activity)}</TableCell>
                  <TableCell>
                    {activity.details?.ip || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>활동 상세 정보</DialogTitle>
                          <DialogDescription>
                            {getActivityMessage(activity)} ({new Date(activity.created_at).toLocaleString()})
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">사용자 정보</h3>
                            <div className="bg-secondary p-3 rounded-md text-sm">
                              <p><strong>이름:</strong> {activity.user?.name || '알 수 없음'}</p>
                              <p><strong>이메일:</strong> {activity.user?.email || '-'}</p>
                              <p><strong>사용자 ID:</strong> {activity.user_id}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">활동 정보</h3>
                            <div className="bg-secondary p-3 rounded-md text-sm">
                              <p><strong>활동 유형:</strong> {activity.activity_type}</p>
                              <p><strong>IP 주소:</strong> {activity.details?.ip || '-'}</p>
                              <p><strong>메서드:</strong> {activity.details?.method || '-'}</p>
                              <p><strong>경로:</strong> {activity.details?.path || '-'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">상세 데이터</h3>
                          <pre className="bg-secondary p-3 rounded-md overflow-auto text-xs max-h-40">
                            {formatDetailsJson(activity.details)}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};