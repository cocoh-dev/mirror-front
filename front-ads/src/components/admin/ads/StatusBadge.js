// /components/admin/ads/StatusBadge.jsx
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isWithinInterval, compareAsc } from 'date-fns';

export const StatusBadge = ({ campaign }) => {
  const getCurrentStatus = () => {
    if (!campaign) return 'inactive';

    const now = new Date();
    // Check if campaign is active based on date and isActive flag
    if (campaign.isActive && 
        campaign.start_date && 
        campaign.end_date && 
        isWithinInterval(now, {
          start: parseISO(campaign.start_date),
          end: parseISO(campaign.end_date)
        })) {
      return 'active';
    }

    // Check if campaign is in the future
    if (compareAsc(now, parseISO(campaign.start_date)) < 0) {
      return 'pending';
    }

    // Check if campaign is manually paused
    if (campaign.paused) {
      return 'paused';
    }

    // Default to inactive if not active
    return 'inactive';
  };

  const variants = {
    active: { variant: 'default', label: '진행중' },
    inactive: { variant: 'secondary', label: '종료됨' },
    pending: { variant: 'outline', label: '대기중' },
    paused: { variant: 'warning', label: '일시중지' },
  };
  
  const status = getCurrentStatus();
  const { variant, label } = variants[status];
  
  return <Badge variant={variant}>{label}</Badge>;
};