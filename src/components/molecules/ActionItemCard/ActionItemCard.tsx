import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ActionItemStatusMenu from '@molecules/ActionItemStatusMenu/ActionItemStatusMenu';
import ActionItemActionsMenu from '@molecules/ActionItemActionsMenu/ActionItemActionsMenu';
import AssigneeAvatar from '@molecules/AssigneeAvatar/AssigneeAvatar';
import ActionItemDueDate from '@molecules/ActionItemDueDate/ActionItemDueDate';
import ActionItemEditDialog from '@organisms/action-items/ActionItemEditDialog/ActionItemEditDialog';
import ActionItemDeleteAlert from '@organisms/action-items/ActionItemDeleteAlert/ActionItemDeleteAlert';
import { BoardActionItem, resolveColumnStatus } from '@/features/action-items/utils';
import { ActionItemColumnStatus } from '@/constants/actionItemStatus';

const columnBorderClass: Record<ActionItemColumnStatus, string> = {
  OPEN: 'border-l-status-open',
  IN_PROGRESS: 'border-l-status-in-progress',
  DONE: 'border-l-status-done',
};

type ActionItemCardProps = {
  item: BoardActionItem;
};

const ActionItemCard = ({ item }: ActionItemCardProps) => {
  const done = item.status === 'DONE';
  const columnStatus = resolveColumnStatus(item.status);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Card className={cn('gap-3 border-l-4 px-4', columnBorderClass[columnStatus])}>
      <div className="flex items-start gap-2">
        <ActionItemStatusMenu item={item} className="mt-0.5" />
        <div className="flex flex-1 flex-col gap-1">
          <span
            className={cn(
              'text-xs',
              done ? 'font-medium text-muted-foreground line-through' : 'font-medium text-foreground',
            )}
          >
            {item.title}
          </span>
          <span className="text-[11px] text-muted-foreground">{item.meetingTitle}</span>
        </div>
        <ActionItemActionsMenu onEdit={() => setIsEditOpen(true)} onDelete={() => setIsDeleteOpen(true)} />
      </div>

      <div className="flex items-center justify-between pl-7">
        {item.assignee ? (
          <div className="flex items-center gap-1.5">
            <AssigneeAvatar name={item.assignee.name} />
            <span className="text-[11px] font-medium text-foreground">{item.assignee.name}</span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">Unassigned</span>
        )}
        <ActionItemDueDate deadline={item.deadline} done={done} className="text-[11px]" />
      </div>

      <ActionItemEditDialog item={item} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <ActionItemDeleteAlert item={item} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </Card>
  );
};

export default ActionItemCard;
