import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ActionItemCardSkeleton from '@molecules/ActionItemCard/ActionItemCardSkeleton';

const DashboardSkeleton = () => (
  <div className="flex w-full flex-col gap-6 p-2">
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-9 w-36" />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-40" />
          <ActionItemCardSkeleton />
          <ActionItemCardSkeleton />
          <ActionItemCardSkeleton />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
