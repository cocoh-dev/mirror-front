// src/app/salons/[id]/components/DisplayManagementTab.js
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Plus,
  MonitorPlay,
  MonitorX,
  Pencil,
  Trash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { addDisplay, updateDisplay, deleteDisplay } from '@/services/salonService';
import DisplayDeleteButton from '@/components/display/DisplayDeleteButton';
import TokenDisplay from './TokenDisplay';

export default function DisplayManagementTab({ salon, salonId }) {
  const queryClient = useQueryClient();
  // 디스플레이 관련 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisplay, setEditingDisplay] = useState(null);
  const [newDisplay, setNewDisplay] = useState({
    name: '',
    device_id: '',
    status: 'active',
    settings: {
      orientation: 'landscape'
    }
  });

  // 디스플레이 추가 뮤테이션
  const addDisplayMutation = useMutation({
    mutationFn: (displayData) => addDisplay(displayData),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', salonId]);
      toast.success('디스플레이가 추가되었습니다.');
      resetDisplayForm();
    },
    onError: (error) => {
      toast.error('디스플레이 추가 중 오류가 발생했습니다: ' + error.message);
    }
  });
  
  // 디스플레이 수정 뮤테이션
  const updateDisplayMutation = useMutation({
    mutationFn: ({ displayId, data }) => updateDisplay(salonId, displayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', salonId]);
      toast.success('디스플레이가 수정되었습니다.');
      resetDisplayForm();
    },
    onError: (error) => {
      toast.error('디스플레이 수정 중 오류가 발생했습니다: ' + error.message);
    }
  });
  
  // 디스플레이 삭제 뮤테이션
  const deleteDisplayMutation = useMutation({
    mutationFn: (displayId) => deleteDisplay(displayId),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', salonId]);
      toast.success('디스플레이가 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error('디스플레이 삭제 중 오류가 발생했습니다: ' + error.message);
    }
  });
  
  // 디스플레이 폼 초기화
  const resetDisplayForm = () => {
    setNewDisplay({
      name: '',
      device_id: '',
      status: 'active',
      settings: {
        orientation: 'landscape'
      }
    });
    setEditingDisplay(null);
    setIsDialogOpen(false);
  };
  
  // 디스플레이 수정 핸들러
  const handleEditDisplay = (display) => {
    setEditingDisplay(display);
    setNewDisplay({
      name: display.name,
      device_id: display.device_id,
      status: display.status || 'active',
      settings: {
        orientation: display.settings?.orientation || 'landscape'
      }
    });
    setIsDialogOpen(true);
  };
  
  // 디스플레이 삭제 핸들러
  const handleDeleteDisplay = (displayId) => {
    if (confirm('정말로 이 디스플레이를 삭제하시겠습니까?')) {
      deleteDisplayMutation.mutate(displayId);
    }
  };
  
  // 디스플레이 추가/수정 제출 핸들러
  const handleDisplaySubmit = (e) => {
    e.preventDefault();
    // 폼 제출 직후 다이얼로그 창 닫기
    setIsDialogOpen(false);
    
    // 새 디스플레이 ID 생성 (실제로는 백엔드에서 처리할 수도 있음)
    const submissionData = { ...newDisplay };
    
    if (editingDisplay) {
      // 기존 디스플레이 수정
      updateDisplayMutation.mutate({ 
        displayId: editingDisplay.device_id, 
        data: submissionData 
      });
    } else {
      // 새 디스플레이 추가 - 서버가 원하는 형식으로 변환
      const addData = {
        name: newDisplay.name,
        salon_id: salonId
      };
      addDisplayMutation.mutate(addData);
    }
    
    // 폼 초기화 (성공/실패 상관없이)
    resetDisplayForm();
  };
  
  return (
    <div>
      <Card className="dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="dark:text-white">디스플레이 정보</CardTitle>
            <CardDescription className="dark:text-gray-400">미용실 디스플레이 수 : {salon.displays ? salon.displays.length : 0}</CardDescription>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            size="sm" 
            className="px-2 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            디스플레이 추가
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          {salon.displays && salon.displays.length > 0 ? (
            <div className="space-y-4">
              {salon.displays.map((display) => (
                <div key={display.device_id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MonitorPlay className="w-5 h-5 text-gray-400 dark:text-gray-300 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium dark:text-white">{display.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {display.device_id}</p>
                    <TokenDisplay token={display.access_token} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">상태: {display.status}</p>
                    {display.settings && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        화면 방향: {display.settings.orientation === 'landscape' ? '가로' : '세로'}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditDisplay(display)}
                      className="dark:hover:bg-gray-600 dark:text-gray-300"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <DisplayDeleteButton 
                      displayId={display.device_id} 
                      displayName={display.name}
                      deleteDisplayMutation={deleteDisplayMutation} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MonitorX className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">등록된 디스플레이가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">디스플레이 추가 버튼을 클릭하여 새 디스플레이를 등록해주세요.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 디스플레이 추가 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDisplay ? '디스플레이 수정' : '새 디스플레이 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDisplaySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">디스플레이 이름</Label>
                <Input
                  id="name"
                  placeholder="입구 디스플레이"
                  value={newDisplay.name}
                  onChange={(e) => setNewDisplay({
                    ...newDisplay,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation">화면 방향</Label>
                <Select
                  value={newDisplay.settings.orientation}
                  onValueChange={(value) => setNewDisplay({
                    ...newDisplay,
                    settings: {
                      ...newDisplay.settings,
                      orientation: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="화면 방향 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">가로</SelectItem>
                    <SelectItem value="portrait">세로</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingDisplay && (
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={newDisplay.status}
                    onValueChange={(value) => setNewDisplay({
                      ...newDisplay,
                      status: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">활성화</SelectItem>
                      <SelectItem value="inactive">비활성화</SelectItem>
                      <SelectItem value="maintenance">점검중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                {editingDisplay ? '수정' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}