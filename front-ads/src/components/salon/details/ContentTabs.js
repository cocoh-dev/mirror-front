// src/app/salons/[id]/components/ContentTabs.js
import { 
  Scissors,
  User,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentTabs({ tabType, salon }) {
  // 서비스 탭 렌더링
  if (tabType === 'services') {
    return (
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
    );
  }
  
  // 스태프 탭 렌더링
  if (tabType === 'staff') {
    return (
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
    );
  }
  
  // 리뷰 탭 렌더링
  if (tabType === 'reviews') {
    return (
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
    );
  }
  
  // 기본적으로 빈 컴포넌트 반환
  return null;
}