// src/app/salons/[id]/page.js
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Edit2, 
  Trash2, 
  History,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  Clock9,
  Save,
  X,
  Loader2,
  // 디스플레이 관리 탭에 필요한 아이콘 추가
  Plus,
  MonitorPlay,
  MonitorX,
  Pencil,
  Trash
} from 'lucide-react';

import { getSalonById, updateSalonStatus, deleteSalon, updateSalon, addDisplay, updateDisplay, deleteDisplay } from '@/services/salonService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/admin/salons/StatusBadge';
import { SubscriptionBadge } from '@/components/admin/salons/SubscriptionBadge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Label } from '@/components/ui/label';
import { formatPhoneNumber, cleanBusinessNumber, cleanPhoneNumber, formatBusinessNumber } from '@/utils/numberFormat';
import { SalonDetailSkeleton } from '@/components/admin/salons/SkeletonLoaders';

import BasicInfoTab from '@/components/salon/details/BasicInfoTab';
import ContentTabs from '@/components/salon/details/ContentTabs';
import DisplayManagementTab from '@/components/salon/details/DisplayManagementTab';

export default function SalonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
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
  const salonId = params.id;
  
  // 미용실 상세 정보 가져오기
  const { 
    data: salonData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['salon', salonId],
    queryFn: () => getSalonById(salonId),
    enabled: !!salonId,
    onSuccess: (data) => {
      // 항상 폼 데이터를 최신 데이터로 설정 (단, 편집 중이 아닐 때만)
      if (!isEditing) {
        setFormData(data.salon);
      }
    }
  });

  // 미용실 업데이트 mutation
  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateSalon(salonId, updatedData),
    onSuccess: () => {
      toast.success('미용실 정보가 업데이트되었습니다.');
      queryClient.invalidateQueries(['salon', salonId]);
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error('미용실 정보 업데이트 중 오류가 발생했습니다.');
      console.error('업데이트 실패:', err);
    }
  });
  
  // 삭제 함수
  const handleDelete = async () => {
    try {
      await deleteSalon(salonId);
      toast.success('미용실이 삭제되었습니다.');
      router.push('/salons');
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
      console.error('삭제 실패:', error);
    }
  };

  // 디스플레이 추가 뮤테이션
  const addDisplayMutation = useMutation({
    mutationFn: (displayData) => addDisplay(params.id, displayData),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', params.id]);
      toast.success('디스플레이가 추가되었습니다.');
      // resetDisplayForm() 제거
    },
    onError: (error) => {
      toast.error('디스플레이 추가 중 오류가 발생했습니다: ' + error.message);
      // 오류 발생시 다시 다이얼로그 열기 옵션 
      // setIsDialogOpen(true);
    }
  });
  
  // 디스플레이 수정 뮤테이션
  const updateDisplayMutation = useMutation({
    mutationFn: ({ displayId, data }) => updateDisplay(params.id, displayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', params.id]);
      toast.success('디스플레이가 수정되었습니다.');
      resetDisplayForm();
    },
    onError: (error) => {
      toast.error('디스플레이 수정 중 오류가 발생했습니다: ' + error.message);
    }
  });
  
  // 디스플레이 삭제 뮤테이션
  const deleteDisplayMutation = useMutation({
    mutationFn: (displayId) => deleteDisplay(params.id, displayId),
    onSuccess: () => {
      queryClient.invalidateQueries(['salon', params.id]);
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
        salon_id: params.id
      };
      addDisplayMutation.mutate(addData);
    }
    
    // 폼 초기화 (성공/실패 상관없이)
    setNewDisplay({
      name: '',
      device_id: '',
      status: 'active',
      settings: {
        orientation: 'landscape'
      }
    });
    setEditingDisplay(null);
  };
  
  // 폼 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 중첩된 객체 속성 처리 (예: location.address_line1)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    
    setFormData({
      ...formData,
      phone: formattedNumber
    });
  };
  
  // 2. 사업자등록번호 입력을 위한 특수 핸들러 추가
  const handleBusinessNumberChange = (e) => {
    const formattedNumber = formatBusinessNumber(e.target.value);
    
    setFormData({
      ...formData,
      business_number: formattedNumber
    });
  };
  

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 제출 전 전화번호와 사업자등록번호에서 하이픈 제거
    const dataToSubmit = {
      ...formData,
      phone: cleanPhoneNumber(formData.phone),
      business_number: cleanBusinessNumber(formData.business_number)
    };
    
    updateMutation.mutate(dataToSubmit);
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    // 원래 데이터로 복원 (명시적으로 복제하여 참조 문제 방지)
    if (salonData && salonData.salon) {
      setFormData({...salonData.salon});
    }
    setIsEditing(false);
  };
  
  // 로딩 상태
  if (isLoading) {
    return (
      <SalonDetailSkeleton />
    );
  }
  
  // 에러 상태
  if (isError) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-destructive">에러 발생</CardTitle>
          <CardDescription>미용실 정보를 불러오는 중 오류가 발생했습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error.message}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/salons')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </CardFooter>
      </Card>
    );
  }
  
  const salon = salonData.salon || {};
  
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push('/salons')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{salon.name}</h1>
            <StatusBadge status={salon.status} />
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit} disabled={updateMutation.isLoading}>
                  <X className="mr-2 h-4 w-4" />
                  취소
                </Button>
                <Button onClick={handleSubmit} disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  저장
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const formattedData = {
                      ...salonData.salon,
                      phone: formatPhoneNumber(salonData.salon.phone),
                      business_number: formatBusinessNumber(salonData.salon.business_number)
                    };
                    setFormData(formattedData);
                    setIsEditing(true);
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  수정
                </Button>
                
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>미용실 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 &apos;{salon.name}&apos; 미용실을 삭제하시겠습니까?
                        이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white">
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
        
        {/* 미용실 상세 내용 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">기본 정보</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            <TabsTrigger value="staff">스태프</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            <TabsTrigger value="display">디스플레이 관리</TabsTrigger>
          </TabsList>

          {/* 기본 정보 탭 */}
          <TabsContent value="info" className="space-y-4">
            <BasicInfoTab 
              salon={salon} 
              isEditing={isEditing} 
              formData={formData} 
              handleChange={handleChange}
              handlePhoneChange={handlePhoneChange}
              handleBusinessNumberChange={handleBusinessNumberChange}
            />
          </TabsContent>
          
          {/* 서비스, 스태프, 리뷰 탭 */}
          <TabsContent value="services">
            <ContentTabs tabType="services" salon={salon} />
          </TabsContent>
          
          <TabsContent value="staff">
            <ContentTabs tabType="staff" salon={salon} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ContentTabs tabType="reviews" salon={salon} />
          </TabsContent>
          
          {/* 디스플레이 관리 탭 */}
          <TabsContent value="display" className="space-y-4">
            <DisplayManagementTab salon={salon} salonId={salon.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}