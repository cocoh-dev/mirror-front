// src/app/salons/[id]/edit/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSalonById, updateSalon } from '@/services/salonService';
import { formatPhoneNumber, cleanPhoneNumber, formatBusinessNumber, cleanBusinessNumber } from '@/utils/numberFormat';
import { StatusBadge } from '@/components/admin/salons/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentTabs from '@/components/salon/details/ContentTabs';
import DisplayManagementTab from '@/components/salon/details/DisplayManagementTab';
import { SalonDetailSkeleton } from '@/components/admin/salons/SkeletonLoaders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StaffTab from '@/components/salon/details/StaffTab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Save, X } from 'lucide-react';
import { CardDescription } from '@/components/ui/card';

import BasicInfoTab from '@/components/salon/details/BasicInfoTab';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function EditSalonPage() {
  const { user } = useAuthCheck();
  const router = useRouter();
  const params = useParams();
  const salonId = params.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState(null);

  // 미용실 상세 정보 불러오기
  const { data: salonData, isLoading, isError, error,refetch } = useQuery({
    queryKey: ['salon', salonId],
    queryFn: () => getSalonById(salonId),
    enabled: !!salonId,
    // 최적화를 위한 staleTime과 cacheTime적용
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 10,
    
    //250428 update : onSuccess제거
    // onSuccess: (data) => {
    //   const formattedData = {
    //     ...data.salon,
    //     phone: formatPhoneNumber(data.salon.phone),
    //     business_number: formatBusinessNumber(data.salon.business_number)
    //   };
    //   setFormData(formattedData);
    // }
  });

  useEffect(() => {
    if(!salonData?.salon) return;

    setFormData({
      ...salonData.salon,
      phone: formatPhoneNumber(salonData.salon.phone),
      business_number: formatBusinessNumber(salonData.salon.business_number),
    });
  },[salonData]);


  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateSalon(salonId, updatedData),
    onSuccess: () => {
      toast.success('미용실 정보가 수정되었습니다.');
      queryClient.invalidateQueries(['salon', salonId]);
      router.push(`/salons/${salonId}`);
    },
    onError: (err) => {
      toast.error('수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      phone: formatPhoneNumber(e.target.value)
    }));
  };
  
  const handleBusinessNumberChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      business_number: formatBusinessNumber(e.target.value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleaned = {
      ...formData,
      phone: cleanPhoneNumber(formData.phone),
      business_number: cleanBusinessNumber(formData.business_number)
    };

    updateMutation.mutate(cleaned);
  };

  const handleCancel = () => {
    router.push(`/salons/${salonId}`);
  };

  // 로딩 상태
  if(isLoading) {
    return(
      <SalonDetailSkeleton />
    )
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

  // formData 세팅전 렌더링 막기
  if(!formData) {
    return <SalonDetailSkeleton />
  }

  const salon = salonData?.salon || {};
  const isOwner = salon.owner_id === user?.id || user?.role === 'superadmin';
  console.log(salonData);

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

            {/* 상태 */}
            <StatusBadge />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={updateMutation.isLoading}
              onClick={() => handleCancel()}
            >
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
          </div>
        </div>
          {/* 탭 */}
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
                isEditing={true}
                formData={formData} 
                handleChange={handleChange} 
                handlePhoneChange={handlePhoneChange} 
                handleBusinessNumberChange={handleBusinessNumberChange} 
              />
            </TabsContent>

            {/* 서비스 탭 */}
            <TabsContent value="services">
              <ContentTabs tabType="services" salon={salon} />
            </TabsContent>

            {/* 스태프 탭 */}
            <TabsContent value="staff">
              <StaffTab salonId={salonId} canEdit={true} />
            </TabsContent>

            {/* 리뷰 탭 */}
            <TabsContent value="reviews">
              <ContentTabs tabType="reviews" salon={salon} />
            </TabsContent>

            {/* 디스플레이 관리 탭 */}
            <TabsContent value="display" className="space-y-4">
              <DisplayManagementTab salon={salon} salonId={salonId} />
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
