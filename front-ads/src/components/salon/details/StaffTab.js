// src/components/salon/details/StaffTab.js
'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import staffService from '@/services/staffService';

export const StaffTab = ({ salonId, canEdit }) => {
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({});
  const [dialogMode, setDialogMode] = useState('add');

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setIsLoading(true);
        const fetchedStaffs = await staffService.getStaffBySalon(salonId);
        // 데이터가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
        setStaffs(Array.isArray(fetchedStaffs) ? fetchedStaffs : []);
      } catch (error) {
        toast.error('스태프 정보를 불러오는 데 실패했습니다.');
        setStaffs([]); // 에러 발생 시에도 빈 배열로 설정
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffs();
  }, [salonId]);

  const handleAddStaff = async () => {
    if (!currentStaff.name || !currentStaff.position || !currentStaff.career_years) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const newStaff = await staffService.createStaff(salonId, {
        name: currentStaff.name,
        position: currentStaff.position,
        career_years: currentStaff.career_years
      });
      
      setStaffs([...staffs, newStaff]);
      setIsDialogOpen(false);
      setCurrentStaff({});
      toast.success('스태프가 추가되었습니다.');
    } catch (error) {
      toast.error('스태프 추가에 실패했습니다.');
    }
  };

  const handleUpdateStaff = async () => {
    if (!currentStaff.id || !currentStaff.name || !currentStaff.position || !currentStaff.career_years) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const updatedStaff = await staffService.updateStaff(salonId, currentStaff.id, {
        name: currentStaff.name,
        position: currentStaff.position,
        career_years: currentStaff.career_years
      });
      
      setStaffs(staffs.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      ));
      setIsDialogOpen(false);
      setCurrentStaff({});
      toast.success('스태프 정보가 수정되었습니다.');
    } catch (error) {
      toast.error('스태프 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('정말로 이 스태프를 삭제하시겠습니까?')) return;

    try {
      await staffService.deleteStaff(salonId, staffId);
      setStaffs(staffs.filter(staff => staff.id !== staffId));
      toast.success('스태프가 삭제되었습니다.');
    } catch (error) {
      toast.error('스태프 삭제에 실패했습니다.');
    }
  };

  const openStaffDialog = (mode, staff) => {
    setDialogMode(mode);
    if (mode === 'edit' && staff) {
      setCurrentStaff(staff);
    } else {
      setCurrentStaff({});
    }
    setIsDialogOpen(true);
  };

  const calculateCareerYears = (careerStart) => {
    if (!careerStart) return '경력 정보 없음';
    
    const startYear = typeof careerStart === 'string' 
      ? new Date(careerStart).getFullYear() 
      : careerStart.getFullYear();
    
    return `경력 ${new Date().getFullYear() - startYear}년`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>스태프</CardTitle>
          <CardDescription>스태프 정보를 불러오는 중...</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="h-4 bg-muted w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-muted w-1/3 mx-auto"></div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="h-3 bg-muted w-full mb-2"></div>
                <div className="h-3 bg-muted w-3/4 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>스태프</CardTitle>
            <CardDescription>미용실 스태프 정보입니다.</CardDescription>
          </div>
          {canEdit && (
            <Button onClick={() => openStaffDialog('add')}>
              <Plus className="mr-2 h-4 w-4" />
              스태프 추가
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {staffs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>등록된 스태프가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffs.map((staff) => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-center">{staff.name}</CardTitle>
                  <CardDescription className="text-center">{staff.position}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {calculateCareerYears(staff.career_years)}
                  </p>
                </CardContent>
                {canEdit && (
                  <CardFooter className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openStaffDialog('edit', staff)}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      수정
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => staff.id && handleDeleteStaff(staff.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? '스태프 추가' : '스태프 정보 수정'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' 
                ? '새로운 스태프 정보를 입력해주세요.' 
                : '스태프 정보를 수정할 수 있습니다.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="스태프 이름"
                value={currentStaff.name || ''}
                onChange={(e) => setCurrentStaff(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">직책</Label>
              <Input
                id="position"
                placeholder="예: 디자이너, 원장"
                value={currentStaff.position || ''}
                onChange={(e) => setCurrentStaff(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="career_years">경력 시작일</Label>
              <Input
                id="career_years"
                type="date"
                value={
                  currentStaff.career_years 
                    ? (typeof currentStaff.career_years === 'string' 
                        ? currentStaff.career_years 
                        : currentStaff.career_years.toISOString().split('T')[0]) 
                    : ''
                }
                onChange={(e) => setCurrentStaff(prev => ({ ...prev, career_years: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button 
              onClick={dialogMode === 'add' ? handleAddStaff : handleUpdateStaff}
            >
              {dialogMode === 'add' ? '추가' : '수정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StaffTab;