// /components/admin/activities/SkeletonLoaders.js
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TableSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
        
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className="border-b p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/8" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/5" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-6" />
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-6" />
            <Skeleton className="h-80 w-full rounded-full" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-6" />
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ReportSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
            
            <div className="space-y-3 mt-4">
              {Array(5).fill(null).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/6" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};