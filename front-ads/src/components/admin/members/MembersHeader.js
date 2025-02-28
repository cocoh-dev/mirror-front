// /components/admin/members/MembersHeader.js
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MembersHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        회원 추가
      </Button>
    </div>
  );
}