import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ActionItemCardSkeleton = () => (
  <Card className="gap-3 border-l-4 border-l-muted px-4">
    <div className="flex items-start gap-2">
      <Skeleton className="mt-0.5 size-5 rounded-md" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
      <Skeleton className="size-5 rounded-md" />
    </div>

    <div className="flex items-center justify-between pl-7">
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-2.5 w-16" />
      </div>
      <Skeleton className="h-2.5 w-12" />
    </div>
  </Card>
);

export default ActionItemCardSkeleton;
