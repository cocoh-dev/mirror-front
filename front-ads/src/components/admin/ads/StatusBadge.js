// /components/admin/ads/StatusBadge.jsx
import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status }) => {
  const variants = {
    "active": { variant: 'default', label: '진행중' },
    "inactive": { variant: 'secondary', label: '종료됨' },
    "pending": { variant: 'outline', label: '대기중' },
    "paused": { variant: 'warning', label: '일시중지' },
  };
  
  // status는 이미 props로 받았으므로 다시 선언할 필요가 없습니다
  const { variant, label } = variants[status] || { variant: 'secondary', label: '알 수 없음' };
  
  return <Badge variant={variant}>{label}</Badge>;
};