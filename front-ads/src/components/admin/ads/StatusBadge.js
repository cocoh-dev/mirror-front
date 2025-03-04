// /components/admin/ads/StatusBadge.jsx
import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status }) => {
  const variants = {
    active: { variant: 'default', label: '진행중' },
    inactive: { variant: 'secondary', label: '종료됨' },
    pending: { variant: 'outline', label: '대기중' },
    paused: { variant: 'warning', label: '일시중지' },
  };
  
  const { variant, label } = variants[status] || variants.inactive;
  
  return <Badge variant={variant}>{label}</Badge>;
};