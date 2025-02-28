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

// 5. SalonActions.js - 드롭다운 메뉴 작업
import { Eye, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SalonActions = ({ salon, onView, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>작업</DropdownMenuLabel>
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onView(salon)}
        >
          <Eye className="h-4 w-4" />
          <span>상세보기</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onEdit(salon)}
        >
          <Edit2 className="h-4 w-4" />
          <span>수정</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive flex items-center gap-2"
          onClick={() => onDelete(salon)}
        >
          <Trash2 className="h-4 w-4" />
          <span>삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};