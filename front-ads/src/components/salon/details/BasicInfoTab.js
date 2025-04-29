// src/app/salons/[id]/components/BasicInfoTab.js
import { 
    MapPin, 
    Phone, 
    Building, 
    User,
    Mail, 
    Calendar, 
    Clock,
    Star
  } from 'lucide-react';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Textarea } from '@/components/ui/textarea';
  import { Separator } from '@/components/ui/separator';
  import { StatusBadge } from '@/components/admin/salons/StatusBadge';
  import { SubscriptionBadge } from '@/components/admin/salons/SubscriptionBadge';
  import { formatPhoneNumber, formatBusinessNumber } from '@/utils/numberFormat';
  
  export default function BasicInfoTab({ 
    salon, 
    isEditing, 
    formData, 
    handleChange, 
    handlePhoneChange,
    handleBusinessNumberChange 
  }) {
    return (
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
                  <p className="text-muted-foreground">{salon.owner.name}</p>
                </div>
              </div>
              
              {/* 이메일 */}
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="w-full">
                  <p className="font-medium">이메일</p>
                  <p className="text-muted-foreground">{salon.owner.email}</p>
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
              
              {/* <Separator /> */}
              
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
  
        {/* 추가 정보 */}
        <Card className="md:col-span-3">
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
      </div>
    );
  }