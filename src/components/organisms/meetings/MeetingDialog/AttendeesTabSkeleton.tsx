import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ATTENDEE_SKELETON_COUNT = 3;

const AttendeesTabSkeleton = () => (
  <div className="scrollbar-subtle max-h-[45vh] space-y-1.5 overflow-y-auto">
    {Array.from({ length: ATTENDEE_SKELETON_COUNT }).map((_, index) => (
      <Card key={index} className="flex-row items-center gap-3 bg-muted/50 px-4 py-3 ring-0">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="ml-auto h-5 w-16 shrink-0 rounded-4xl" />
      </Card>
    ))}
  </div>
);

export default AttendeesTabSkeleton;
