// /admin/ads/add/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 컴포넌트 임포트
import { AdDetailsTab } from '@/components/admin/ads/AdDetailsTab';
import { AdMediaTab } from '@/components/admin/ads/AdMediaTab';
import { AdScheduleTab } from '@/components/admin/ads/AdScheduleTab';
import { AdLocationTab } from '@/components/admin/ads/AdLocationTab';

// 서비스 임포트
import { createAd, updateAdMedia } from '@/services/adService';

export default function AddAdPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 초기 폼 데이터 설정
  const [formData, setFormData] = useState({
    title: "",
    type: "sponsor",
    is_active: true,
    media: [],
    schedules: [],
    targetLocations: []
  });
  
  const [uploadFiles, setUploadFiles] = useState([]);
  
  // 광고 생성 mutation - 백엔드 수정 API와 유사한 구조 가정
  const createMutation = useMutation({
    mutationFn: (data) => createAd(data),
    onSuccess: (data) => {
      toast.success('광고가 생성되었습니다.');
      queryClient.invalidateQueries(['ads']); // 광고 목록 캐시 무효화
      
      // 생성된 광고 ID로 이동
      if (data && data.id) {
        router.push(`/admin/ads/${data.id}`);
      } else {
        router.push('/admin/ads');
      }
    },
    onError: (err) => {
      toast.error('광고 생성에 실패했습니다.');
      console.error('Error creating ad:', err);
    }
  });
  
  // 미디어 업로드 mutation - 생성 후 별도로 미디어 처리 필요한 경우
  const mediaUploadMutation = useMutation({
    mutationFn: ({ id, formData }) => updateAdMedia(id, formData),
    onSuccess: (data) => {
      toast.success('미디어가 업로드되었습니다.');
    },
    onError: (err) => {
      toast.error('미디어 업로드에 실패했습니다.');
    }
  });
  
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMediaUpload = (e, sizeType) => {
    const files = Array.from(e.target.files);
    const filesWithType = files.map(file => ({
      file,
      sizeType
    }));
    setUploadFiles(prev => [...prev, ...filesWithType]);
  };
  
  const removeUploadFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingMedia = (mediaId) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== mediaId)
    }));
  };
  
  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { time: "12:00:00" }]
    }));
  };
  
  const updateSchedule = (index, time) => {
    setFormData(prev => {
      const newSchedules = [...prev.schedules];
      newSchedules[index] = { ...newSchedules[index], time };
      return { ...prev, schedules: newSchedules };
    });
  };
  
  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };
  
  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      targetLocations: [...prev.targetLocations, { 
        target_type: 'nationwide',
        city: '',
        district: '',
        radius: 0,
        center_latitude: 0,
        center_longitude: 0
      }]
    }));
  };
  
  const updateLocation = (index, field, value) => {
    setFormData(prev => {
      const newLocations = [...prev.targetLocations];
      newLocations[index] = { ...newLocations[index], [field]: value };
      return { ...prev, targetLocations: newLocations };
    });
  };
  
  const removeLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      targetLocations: prev.targetLocations.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      const adData = {
        title: formData.title,
        type: formData.type,
        is_active: formData.is_active,
        schedules: formData.schedules.map(s => s.time),
        targetLocations: formData.targetLocations
      };
      
      const createdAd = await createMutation.mutateAsync(adData);
      
      // 미디어 파일 업로드 처리 (광고 생성 후)
      if (uploadFiles.length > 0) {
        
        if (createdAd) {
          // ID 검증 및 대체 방법 시도
          const adId = createdAd.ad.id;
          
          if (adId) {
            const mediaFormData = new FormData();
            
            const minFiles = uploadFiles.filter(fileObj => fileObj.sizeType === 'min');
            const maxFiles = uploadFiles.filter(fileObj => fileObj.sizeType === 'max');
            
            minFiles.forEach(fileObj => {
              mediaFormData.append('minFiles', fileObj.file);
            });
            
            maxFiles.forEach(fileObj => {
              mediaFormData.append('maxFiles', fileObj.file);
            });
            
            // 생성된 광고 ID로 미디어 업로드
            const mediaResult = await mediaUploadMutation.mutateAsync({
              id: adId,
              formData: mediaFormData
            });
            
          } else {
            console.error('광고 ID를 찾을 수 없음:', createdAd);
          }
        } else {
          console.error('생성된 광고 데이터가 없음');
        }
      }
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push('/admin/ads')}>
          ← 목록으로
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit} 
            disabled={createMutation.isLoading || mediaUploadMutation.isLoading}
          >
            {createMutation.isLoading || mediaUploadMutation.isLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">광고 추가</h1>
        <p className="text-muted-foreground">새로운 광고를 추가합니다.</p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">기본 정보</TabsTrigger>
          <TabsTrigger value="media">미디어</TabsTrigger>
          <TabsTrigger value="schedule">스케줄</TabsTrigger>
          <TabsTrigger value="location">위치 타겟팅</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AdDetailsTab 
            adData={{}} // 빈 객체 전달 (신규 생성이므로)
            formData={formData}
            editMode={true} // 항상 편집 모드
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="media">
          <AdMediaTab
            formData={formData}
            editMode={true} // 항상 편집 모드
            uploadFiles={uploadFiles}
            onMediaUpload={handleMediaUpload}
            onRemoveUploadFile={removeUploadFile}
            onRemoveExistingMedia={removeExistingMedia}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading || mediaUploadMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <AdScheduleTab
            formData={formData}
            editMode={true} // 항상 편집 모드
            onAddSchedule={addSchedule}
            onUpdateSchedule={updateSchedule}
            onRemoveSchedule={removeSchedule}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="location">
          <AdLocationTab
            formData={formData}
            editMode={true} // 항상 편집 모드
            onAddLocation={addLocation}
            onUpdateLocation={updateLocation}
            onRemoveLocation={removeLocation}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading}
          />
        </TabsContent>
      </Tabs>
      
      {/* 로딩 인디케이터 */}
      {(createMutation.isLoading || mediaUploadMutation.isLoading) && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
          <span>작업 처리 중...</span>
        </div>
      )}
    </div>
  );
}