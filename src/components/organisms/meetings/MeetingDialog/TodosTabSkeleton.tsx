import { Skeleton } from '@/components/ui/skeleton';
import ActionItemCardSkeleton from '@molecules/ActionItemCard/ActionItemCardSkeleton';

const TODO_SKELETON_COUNT = 3;

const TodosTabSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="h-8 w-28 self-end rounded-md" />
    <div className="flex flex-col gap-2">
      {Array.from({ length: TODO_SKELETON_COUNT }).map((_, index) => (
        <ActionItemCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default TodosTabSkeleton;
