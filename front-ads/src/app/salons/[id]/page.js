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
  Loader2
} from 'lucide-react';

import { getSalonById, updateSalonStatus, deleteSalon, updateSalon } from '@/services/salonService';
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
import { formatPhoneNumber, cleanBusinessNumber, cleanPhoneNumber, formatBusinessNumber } from '@/utils/numberFormat';

export default function SalonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  
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
  
  // 상태 변경 함수
  const handleStatusChange = async (newStatus) => {
    try {
      await updateSalonStatus(salonId, newStatus);
      toast.success('미용실 상태가 변경되었습니다.');
      refetch();
    } catch (error) {
      toast.error('상태 변경 중 오류가 발생했습니다.');
      console.error('상태 변경 실패:', error);
    }
  };
  
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
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        </TabsList>
        
        {/* 기본 정보 탭 */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 기본 정보 카드 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* 미용실 이름 */}
                  {isEditing && (
                    <div className="space-y-2">
                      <label className="font-medium">미용실명</label>
                      <Input 
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  
                  {/* 주소 */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">주소</p>
                      {isEditing ? (
                        <div className="space-y-2 mt-1">
                          <Input 
                            name="location.address_line1"
                            value={formData?.location?.address_line1 || ''}
                            onChange={handleChange}
                            placeholder="주소"
                            className="mb-2"
                          />
                          <Input 
                            name="location.address_line2"
                            value={formData?.location?.address_line2 || ''}
                            onChange={handleChange}
                            placeholder="상세 주소"
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">{salon.location.address_line1} {salon.location.address_line2}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 연락처 */}
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">연락처</p>
                      {isEditing ? (
                        <Input 
                          name="phone"
                          value={formData?.phone || ''}
                          onChange={handlePhoneChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{formatPhoneNumber(salon.phone)}</p>
                      )}
                    </div>
                  </div>

                  {/* 사업자등록번호 */}
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">사업자등록번호</p>
                      {isEditing ? (
                        <Input 
                          name="business_number"
                          value={formData?.business_number || ''}
                          onChange={handleBusinessNumberChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{formatBusinessNumber(salon.business_number)}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 대표자 */}
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">대표자</p>
                      {isEditing ? (
                        <Input 
                          name="owner.name"
                          value={formData?.owner?.name || ''}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{salon.owner.name}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 이메일 */}
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">이메일</p>
                      {isEditing ? (
                        <Input 
                          name="owner.email"
                          value={formData?.owner?.email || ''}
                          onChange={handleChange}
                          type="email"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{salon.owner.email}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 등록일 */}
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">등록일</p>
                      <p className="text-muted-foreground">{new Date(salon.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* 영업 시간 */}
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium">영업 시간</p>
                      {isEditing ? (
                        <Input 
                          name="business_hours"
                          value={formData?.business_hours || '월-금: 10:00 - 20:00, 토: 10:00 - 18:00, 일: 휴무'}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {salon.business_hours || '월-금: 10:00 - 20:00, 토: 10:00 - 18:00, 일: 휴무'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 상태 및 통계 카드 */}
            <div className="space-y-4">
              {/* 상태 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>상태</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">현재 상태</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={salon.status} />
                      <SubscriptionBadge type={salon.subscriptionType} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                </CardContent>
              </Card>
              
              {/* 통계 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">평점</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                          <span>{salon.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">총 {salon.reviewCount}개 리뷰</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">방문 예약</span>
                        <span>{salon.bookingCount || 45}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">지난 30일 동안</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">페이지 조회</span>
                        <span>{salon.viewCount || 256}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">지난 30일 동안</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>소개 및 설명</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea 
                  name="description"
                  value={formData?.description || `${formData?.name}은 고객 만족을 최우선으로 생각하는 미용실입니다. 
                  최신 트렌드와 기술을 활용하여 고객에게 최상의 서비스를 제공합니다. 
                  숙련된 헤어 디자이너들이 고객의 개성과 스타일에 맞는
                  최적의 헤어스타일을 찾아드립니다.`}
                  onChange={handleChange}
                  rows={6}
                />
              ) : (
                <p className="whitespace-pre-line">
                  {salon.description || 
                  `${salon.name}은 고객 만족을 최우선으로 생각하는 미용실입니다. 
                  최신 트렌드와 기술을 활용하여 고객에게 최상의 서비스를 제공합니다. 
                  숙련된 헤어 디자이너들이 고객의 개성과 스타일에 맞는
                  최적의 헤어스타일을 찾아드립니다.`}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 서비스 탭 */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>제공 서비스</CardTitle>
              <CardDescription>미용실에서 제공하는 서비스 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {salon.services && salon.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 여기에 서비스 목록 표시 */}
                  {/* 서비스 데이터가 없으므로 예시 데이터 사용 */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">커트</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">₩15,000 ~ ₩30,000</div>
                      <div className="text-sm mt-1">30분 ~ 1시간</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">염색</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">₩50,000 ~ ₩80,000</div>
                      <div className="text-sm mt-1">1시간 30분 ~ 2시간</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">펌</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">₩70,000 ~ ₩120,000</div>
                      <div className="text-sm mt-1">2시간 ~ 3시간</div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Scissors className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>등록된 서비스가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 스태프 탭 */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>스태프</CardTitle>
              <CardDescription>미용실 스태프 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 스태프 데이터가 없으므로 예시 데이터 사용 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-center">김미영</CardTitle>
                    <CardDescription className="text-center">원장</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">경력 10년</p>
                    <p className="text-sm">커트, 염색, 펌 전문</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-center">박준호</CardTitle>
                    <CardDescription className="text-center">디자이너</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">경력 5년</p>
                    <p className="text-sm">남성 커트, 스타일링 전문</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 리뷰 탭 */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>고객 리뷰</CardTitle>
              <CardDescription>
                평균 평점: <Star className="inline-block h-4 w-4 fill-yellow-500 text-yellow-500 mx-1" />
                {salon.rating} ({salon.reviewCount}개 리뷰)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 리뷰 데이터가 없으므로 예시 데이터 사용 */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">김지수</CardTitle>
                        <CardDescription>2024년 1월 15일</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      서비스가 정말 좋았어요! 원장님이 제 얼굴형에 맞는 스타일을 제안해주셔서 만족스러운 결과를 얻었습니다.
                      다음에도 방문할 예정입니다.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">이현우</CardTitle>
                        <CardDescription>2023년 12월 22일</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      디자이너 박준호님의 기술이 정말 좋습니다. 내가 원하는 스타일을 정확히 이해하고 
                      완벽하게 구현해주셨어요. 다만 예약 시스템이 조금 불편했습니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
    </div>
  );
}