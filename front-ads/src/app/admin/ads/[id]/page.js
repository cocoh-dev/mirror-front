// /admin/ads/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

// 컴포넌트 임포트
import { AdDetailsTab } from '@/components/admin/ads/AdDetailsTab';
import { AdMediaTab } from '@/components/admin/ads/AdMediaTab';
import { AdScheduleTab } from '@/components/admin/ads/AdScheduleTab';
import { AdLocationTab } from '@/components/admin/ads/AdLocationTab';

// 서비스 임포트
import { getAdById, updateAd, deleteAd, updateAdMedia } from '@/services/adService';

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;
  const [adData, setAdData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    is_active: true,
    media: [],
    schedules: [],
    targetLocations: []
  });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [deleting, setDeleting] = useState(false);

  // 광고 정보 가져오기
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['ad', id],
    queryFn: () => getAdById(id),
  });

  useEffect(() => {
    if (data && data.ad) {
      setAdData(data.ad);
      setFormData({
        title: data.ad.title,
        type: data.ad.type,
        is_active: data.ad.is_active,
        salon_id: data.ad.salon_id,
        media: data.ad.media || [],
        schedules: data.ad.AdSchedules || [],
        targetLocations: data.ad.AdLocations || []
      });
    }
  }, [data]);

  // 광고 업데이트 뮤테이션
  const updateMutation = useMutation({
    mutationFn: (data) => updateAd(id, data),
    onSuccess: () => {
      toast.success('광고 정보가 업데이트되었습니다.');
      queryClient.invalidateQueries(['ad', id]);
      setEditMode(false);
    },
    onError: (err) => {
      toast.error('광고 정보 업데이트에 실패했습니다.');
      console.error('Error updating ad:', err);
    }
  });

  // 광고 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: () => deleteAd(id),
    onSuccess: () => {
      toast.success('광고가 삭제되었습니다.');
      router.push('/admin/ads');
    },
    onError: (err) => {
      toast.error('광고 삭제에 실패했습니다.');
      console.error('Error deleting ad:', err);
      setDeleting(false);
    }
  });

  // 미디어 업로드 뮤테이션
  const mediaUploadMutation = useMutation({
    mutationFn: (formData) => updateAdMedia(id, formData),
    onSuccess: (data) => {
      toast.success('미디어가 업로드되었습니다.');
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, ...data.media]
      }));
      setUploadFiles([]);
      queryClient.invalidateQueries(['ad', id]);
    },
    onError: (err) => {
      toast.error('미디어 업로드에 실패했습니다.');
      console.error('Error uploading media:', err);
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
      let updatedMedia = [...formData.media]; // 기존 미디어 복사
      
      // 미디어 파일 업로드 처리
      if (uploadFiles.length > 0) {
        const mediaFormData = new FormData();
        
        const minFiles = uploadFiles.filter(fileObj => fileObj.sizeType === 'min');
        const maxFiles = uploadFiles.filter(fileObj => fileObj.sizeType === 'max');
        
        minFiles.forEach(fileObj => {
          mediaFormData.append('minFiles', fileObj.file);
        });
        
        maxFiles.forEach(fileObj => {
          mediaFormData.append('maxFiles', fileObj.file);
        });
        
        // 미디어 업로드 결과를 직접 받아서 처리
        const result = await mediaUploadMutation.mutateAsync(mediaFormData);
        if (result.media && result.media.length > 0) {
          updatedMedia = [...updatedMedia, ...result.media];
        }
      }
      
      // 광고 정보 업데이트
      const adData = {
        title: formData.title,
        type: formData.type,
        is_active: formData.is_active,
        salon_id: formData.salon_id,
        media: updatedMedia, // 직접 업데이트된 미디어 배열 사용
        schedules: formData.schedules.map(s => s.time),
        targetLocations: formData.targetLocations
      };
      
      await updateMutation.mutateAsync(adData);
    } catch (error) {
      console.error('Error saving ad data:', error);
    }
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteMutation.mutate();
  };

  const cancelEdit = () => {
    setEditMode(false);
    // 수정 취소시 원래 데이터로 복원
    if (adData) {
      setFormData({
        title: adData.title,
        type: adData.type,
        is_active: adData.is_active,
        salon_id: adData.salon_id,
        media: adData.media || [],
        schedules: adData.AdSchedules || [],
        targetLocations: adData.AdLocations || []
      });
    }
    setUploadFiles([]);
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    );
  }

  // 에러 표시
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error?.message || '광고 정보를 불러오는데 실패했습니다.'}</div>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push('/admin/ads')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!adData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">광고를 찾을 수 없습니다.</div>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push('/admin/ads')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push('/admin/ads')}>
          ← 목록으로
        </Button>
        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>수정</Button>
          ) : (
            <Button variant="outline" onClick={cancelEdit}>
              취소
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">삭제</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>광고 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 광고를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  disabled={deleting}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            adData={adData}
            formData={formData}
            editMode={editMode}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="media">
          <AdMediaTab
            formData={formData}
            editMode={editMode}
            uploadFiles={uploadFiles}
            onMediaUpload={handleMediaUpload}
            onRemoveUploadFile={removeUploadFile}
            onRemoveExistingMedia={removeExistingMedia}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isLoading || mediaUploadMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <AdScheduleTab
            formData={formData}
            editMode={editMode}
            onAddSchedule={addSchedule}
            onUpdateSchedule={updateSchedule}
            onRemoveSchedule={removeSchedule}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isLoading}
          />
        </TabsContent>

        <TabsContent value="location">
          <AdLocationTab
            formData={formData}
            editMode={editMode}
            onAddLocation={addLocation}
            onUpdateLocation={updateLocation}
            onRemoveLocation={removeLocation}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}