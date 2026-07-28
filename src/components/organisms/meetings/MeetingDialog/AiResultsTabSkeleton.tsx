import { Skeleton } from '@/components/ui/skeleton';

const AiResultsTabSkeleton = () => (
  <div className="flex flex-col gap-5">
    <div className="flex justify-end">
      <Skeleton className="h-9 w-36 rounded-full" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export default AiResultsTabSkeleton;
