import { Badge } from '@/components/ui/badge';

export const SubscriptionBadge = ({ type }) => {
  const variants = {
    free: { variant: 'outline', label: '무료' },
    standard: { variant: 'secondary', label: '스탠다드' },
    premium: { variant: 'default', label: '프리미엄' },
  };
  
  const { variant, label } = variants[type] || variants.free;
  
  return <Badge variant={variant}>{label}</Badge>;
};
