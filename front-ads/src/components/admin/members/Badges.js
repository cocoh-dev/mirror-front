// /components/admin/members/Badges.js
import { Badge } from '@/components/ui/badge';

// 상태 뱃지 컴포넌트
export function StatusBadge({ status }) {
  const variants = {
    active: { variant: 'default', label: '활성' },
    inactive: { variant: 'outline', label: '비활성' },
    suspended: { variant: 'destructive', label: '정지됨' },
  };
  
  const { variant, label } = variants[status] || variants.inactive;
  
  return <Badge variant={variant}>{label}</Badge>;
}

// 역할 뱃지 컴포넌트
export function RoleBadge({ role }) {
  const variants = {
    user: { variant: 'secondary', label: '일반회원' },
    salonOwner: { variant: 'secondary', label: '미용실주' },
    admin: { variant: 'default', label: '관리자' },
    superadmin: { variant: 'default', label: '슈퍼관리자' },
  };
  
  const { variant, label } = variants[role] || variants.user;
  
  return <Badge variant={variant}>{label}</Badge>;
}