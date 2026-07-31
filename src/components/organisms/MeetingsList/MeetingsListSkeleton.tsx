import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ROW_COUNT = 6;

export function MeetingsListSkeleton() {
  return (
    <div className="flex max-h-[80vh] w-full flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex min-h-0 flex-1 flex-col divide-y divide-border/60">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-4 py-3.5">
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20 shrink-0 rounded-4xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
