import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ActionItemStatusIcon from '@atoms/ActionItemStatusIcon/ActionItemStatusIcon';
import { useUpdateActionItem } from '@/features/action-items/hooks/useActionItemMutations';
import { BoardActionItem, resolveColumnStatus } from '@/features/action-items/utils';
import {
  ACTION_ITEM_COLUMNS,
  ACTION_ITEM_COLUMN_LABELS,
  ActionItemColumnStatus,
} from '@/constants/actionItemStatus';

const dotClass: Record<ActionItemColumnStatus, string> = {
  OPEN: 'bg-status-open',
  IN_PROGRESS: 'bg-status-in-progress',
  DONE: 'bg-status-done',
};

type ActionItemStatusMenuProps = {
  item: BoardActionItem;
  className?: string;
};

const ActionItemStatusMenu = ({ item, className }: ActionItemStatusMenuProps) => {
  const { mutate } = useUpdateActionItem();
  const currentStatus = resolveColumnStatus(item.status);

  const handleSelect = (status: ActionItemColumnStatus) => {
    if (status === currentStatus) return;
    mutate({ meetingId: item.meetingId, actionItemId: item.id, status });
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={<DropdownMenuTrigger />}
          className={cn('cursor-pointer appearance-none border-0 bg-transparent p-0', className)}
          aria-label={`Change status, currently ${ACTION_ITEM_COLUMN_LABELS[currentStatus]}`}
        >
          <ActionItemStatusIcon status={currentStatus} />
        </TooltipTrigger>
        <TooltipContent>{ACTION_ITEM_COLUMN_LABELS[currentStatus]} · click to change status</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="min-w-40">
        {ACTION_ITEM_COLUMNS.map((status) => (
          <DropdownMenuItem key={status} onClick={() => handleSelect(status)}>
            <span className={cn('size-1.5 shrink-0 rounded-full', dotClass[status])} aria-hidden="true" />
            <span className="flex-1">{ACTION_ITEM_COLUMN_LABELS[status]}</span>
            {status === currentStatus && <Check className="size-3.5 shrink-0 text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionItemStatusMenu;
