import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ActionItemCardSkeleton from '@molecules/ActionItemCard/ActionItemCardSkeleton';
import {
  ACTION_ITEM_COLUMNS,
  ACTION_ITEM_COLUMN_LABELS,
  ActionItemColumnStatus,
} from '@/constants/actionItemStatus';

const columnDotClass: Record<ActionItemColumnStatus, string> = {
  OPEN: 'bg-status-open',
  IN_PROGRESS: 'bg-status-in-progress',
  DONE: 'bg-status-done',
};

const CARD_SKELETON_COUNT = 3;

const ActionItemsBoardSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {ACTION_ITEM_COLUMNS.map((status) => (
      <div
        key={status}
        className="flex h-176 min-w-0 flex-col gap-3 rounded-xl border border-foreground/25 bg-muted/40 p-3 shadow-(--shadow)"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span
              className={cn('size-2 shrink-0 rounded-full', columnDotClass[status])}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-foreground">
              {ACTION_ITEM_COLUMN_LABELS[status]}
            </span>
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-hidden pr-1">
          {Array.from({ length: CARD_SKELETON_COUNT }).map((_, index) => (
            <ActionItemCardSkeleton key={index} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ActionItemsBoardSkeleton;
