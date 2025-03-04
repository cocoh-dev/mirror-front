import { Building, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { SubscriptionBadge } from './SubscriptionBadge';
import { SalonRating } from './SalonRating';
import { SalonActions } from './SalonActions';

export const SalonCard = ({ salon, onView, onEdit, onDelete }) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]"
      onClick={(e) => {
        // 이벤트 버블링 방지 - SalonActions의 클릭이 Card 클릭으로 전파되지 않도록
        if (e.target.closest('.salon-actions')) return;
        onView(salon);
      }}
    >
      <div className="h-40 bg-muted flex items-center justify-center">
        <Building className="h-10 w-10 text-muted-foreground" />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{salon.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {salon.location.address_line1} {salon.location.address_line2}
            </CardDescription>
          </div>
          <StatusBadge status={salon.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mt-2">
          <div>대표: {salon.owner.name}</div>
          <div>연락처: {salon.phone}</div>
          <div className="mt-1">
            <SalonRating rating={salon.rating} reviewCount={salon.reviewCount} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
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