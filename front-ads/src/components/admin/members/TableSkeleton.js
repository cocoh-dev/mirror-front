// /components/admin/members/MembersTableSkeleton.js
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TableSkeleton() {
  return (
    <Card>
      <CardHeader className="p-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-4" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-36" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-28" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      </CardContent>
    </Card>
  );
}