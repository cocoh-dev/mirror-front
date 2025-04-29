import { Building, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { SubscriptionBadge } from './SubscriptionBadge';
import { SalonRating } from './SalonRating';
import { SalonActions } from './SalonActions';
import { formatPhoneNumber, formatBusinessNumber } from '@/utils/numberFormat';

export const SalonCard = ({ salon, onView, onEdit, onDelete }) => {
  return (
    // 운영중인 미용실 카드
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
      dark:bg-gray-700 dark:shadow-md dark:shadow-black/20 dark:rounded-xl"
      onClick={(e) => {
        // 이벤트 버블링 방지 - SalonActions의 클릭이 Card 클릭으로 전파되지 않도록
        if (e.target.closest('.salon-actions')) return;
        onView(salon);
      }}
    >
      {/* 미용실 이미지 박스 todo: dark:bg-white 추가예정*/}
      <div className="h-40 bg-muted flex items-center justify-center">
        {/* 현재 임시로 들어가있는 건물 이미지 */}
        <Building className="h-10 w-10 text-muted-foreground" />
      </div>
      {/* 카드헤더: 이름, 주소, 상태 */}
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{salon.name}</CardTitle>
            <CardDescription className="flex items-center mt-1 dark:text-white">
              <MapPin className="h-3 w-3 mr-1" />
              {salon.location.address_line1} {salon.location.address_line2}
            </CardDescription>
          </div>
          {/* StatusBadge에 스타일 적용시 StatusBadge컴포넌트에 스타일 적용할 것것 */}
          <StatusBadge status={salon.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mt-2 dark:text-white">
          <div>대표: {salon.owner.name}</div>
          <div>연락처: {formatPhoneNumber(salon.phone)}</div>
          <div className="mt-1">
            <SalonRating rating={salon.rating} reviewCount={salon.reviewCount} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {/* SubscriptionBadge 스타일 적용시 SubscriptionBadge컴포넌트에에 스타일 적용할 것것 */}
        <SubscriptionBadge type={salon.subscriptionType} />
        <div className="salon-actions">
          <SalonActions 
            salon={salon}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </CardFooter>
    </Card>
  );
};