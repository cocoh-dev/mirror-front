import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SalonPageHeader = ({ onAddSalon }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">미용실 관리</h1>
      <Button onClick={onAddSalon}>
        <Plus className="mr-2 h-4 w-4" />
        미용실 추가
      </Button>
    </div>
  );
};
