import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_CARD_COUNT = 3;
const BOTTOM_CARD_COUNT = 2;

const ProfileSkeleton = () => (
  <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <Skeleton className="size-36 shrink-0 rounded-full" />
        <div className="flex w-full flex-col items-center gap-2 sm:items-start">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: STAT_CARD_COUNT }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-32" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: BOTTOM_CARD_COUNT }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="mt-auto flex justify-end">
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
