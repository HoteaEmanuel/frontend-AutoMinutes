import { Skeleton } from '@/components/ui/skeleton';

const TranscriptTabSkeleton = () => (
  <div className="flex min-w-0 flex-col gap-2">
    <div className="flex flex-wrap items-center justify-end gap-1">
      <Skeleton className="h-8 w-40 rounded-md" />
    </div>
    <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);

export default TranscriptTabSkeleton;
