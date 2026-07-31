import { Skeleton } from '@/components/ui/skeleton';

const MeetingDetailSkeleton = () => (
  <div className="flex w-full flex-col gap-4">
    <Skeleton className="h-5 w-36" />

    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <div className="ml-auto hidden gap-2 sm:flex">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
    </div>

    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-24" />
      ))}
    </div>

    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:p-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default MeetingDetailSkeleton;
