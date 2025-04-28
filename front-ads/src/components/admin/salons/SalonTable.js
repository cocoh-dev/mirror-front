import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { SubscriptionBadge } from './SubscriptionBadge';
import { SalonRating } from './SalonRating';
import { SalonActions } from './SalonActions';
import { formatPhoneNumber, formatBusinessNumber } from '@/utils/numberFormat';

export const SalonTable = ({ salons, onView, onEdit, onDelete }) => {
  return (
    <Card className="dark:border dark:border-gray-600">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-xl">
              {/* UX관점에서 salon Table PK는 필요없을 것 같아서 주석처리 */}
              {/* <TableHead>ID</TableHead> */}
              <TableHead className="dark:text-white">미용실명</TableHead>
              <TableHead className="dark:text-white">주소</TableHead>
              <TableHead className="dark:text-white">대표</TableHead>
              <TableHead className="dark:text-white">연락처</TableHead>
              <TableHead className="dark:text-white">상태</TableHead>
              <TableHead className="dark:text-white">구독</TableHead>
              <TableHead className="dark:text-white">평점</TableHead>
              <TableHead className="dark:text-white">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.map((salon) => (
              <TableRow 
                key={salon.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={(e) => {
                  // 이벤트 버블링 방지 - SalonActions의 클릭이 행 클릭으로 전파되지 않도록
                  if (e.target.closest('.salon-actions')) return;
                  onView(salon);
                }}
              >
                {/* UX관점에서 salon Table PK는 필요없을 것 같아서 주석처리 */}
                {/* <TableCell className="font-medium">{salon.id}</TableCell> */}
                <TableCell>{salon.name}</TableCell>
                <TableCell>{salon.location.address_line1} {salon.location.address_line2}</TableCell>
                <TableCell>{salon.owner.name}</TableCell>
                <TableCell>{formatPhoneNumber(salon.phone)}</TableCell>
                <TableCell>
                  <StatusBadge status={salon.status} />
                </TableCell>
                <TableCell>
                  <SubscriptionBadge type={salon.subscriptionType} />
                </TableCell>
                <TableCell>
                  <SalonRating rating={salon.rating} reviewCount={salon.reviewCount} />
                </TableCell>
                <TableCell className="">
                  <div className="salon-actions">
                    <SalonActions 
                      salon={salon}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};