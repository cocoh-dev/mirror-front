import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { SubscriptionBadge } from './SubscriptionBadge';
import { SalonRating } from './SalonRating';
import { SalonActions } from './SalonActions';

export const SalonTable = ({ salons, onView, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>미용실명</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>대표</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>구독</TableHead>
              <TableHead>평점</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.map((salon) => (
              <TableRow key={salon.id}>
                <TableCell className="font-medium">{salon.id}</TableCell>
                <TableCell>{salon.name}</TableCell>
                <TableCell>{salon.address}</TableCell>
                <TableCell>{salon.owner}</TableCell>
                <TableCell>{salon.phone}</TableCell>
                <TableCell>
                  <StatusBadge status={salon.status} />
                </TableCell>
                <TableCell>
                  <SubscriptionBadge type={salon.subscriptionType} />
                </TableCell>
                <TableCell>
                  <SalonRating rating={salon.rating} reviewCount={salon.reviewCount} />
                </TableCell>
                <TableCell className="text-right">
                  <SalonActions 
                    salon={salon}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};