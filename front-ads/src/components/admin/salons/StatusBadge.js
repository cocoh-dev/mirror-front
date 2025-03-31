import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status }) => {
  const variants = {
    approved: { variant: 'default', label: '인증됨', icon: CheckCircle },
    pending: { variant: 'outline', label: '심사중', icon: null },
    rejected: { variant: 'destructive', label: '반려됨', icon: XCircle },
  };
  
  const { variant, label, icon: Icon } = variants[status] || variants.pending;
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};