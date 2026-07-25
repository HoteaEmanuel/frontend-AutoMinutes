import { useState } from 'react';
import { cn } from '@/lib/utils';
import ActionItemCard from '@molecules/ActionItemCard/ActionItemCard';
import ActionItemsSortMenu from '@molecules/ActionItemsSortMenu/ActionItemsSortMenu';
import { ActionItemColumnStatus, ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { ActionItemSortOption } from '@/constants/actionItemSort';
import { BoardActionItem, sortActionItems } from '@/features/action-items/utils';

const columnDotClass: Record<ActionItemColumnStatus, string> = {
  OPEN: 'bg-status-open',
  IN_PROGRESS: 'bg-status-in-progress',
  DONE: 'bg-status-done',
};

type ActionItemsColumnProps = {
  status: ActionItemColumnStatus;
  items: BoardActionItem[];
};

const ActionItemsColumn = ({ status, items }: ActionItemsColumnProps) => {
  const [sort, setSort] = useState<ActionItemSortOption | null>(null);
  const sortedItems = sortActionItems(items, sort);

  return (
    <div className="flex h-176 min-w-0 flex-col gap-3 rounded-xl border border-foreground/25 bg-muted/40 p-3 shadow-(--shadow)">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn('size-2 shrink-0 rounded-full', columnDotClass[status])} aria-hidden="true" />
          <span className="text-sm font-semibold text-foreground">{ACTION_ITEM_COLUMN_LABELS[status]}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-xs font-medium text-muted-foreground">
            {items.length}
          </span>
        </div>
        <ActionItemsSortMenu sort={sort} onSortChange={setSort} />
      </div>

      <div className="scrollbar-themed flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {sortedItems.length === 0 ? (
          <p className="px-1 text-xs text-muted-foreground">No action items</p>
        ) : (
          sortedItems.map((item) => <ActionItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default ActionItemsColumn;
