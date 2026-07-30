import { cn } from '@/lib/utils';
import { isActionItemOverdue } from '@/features/action-items/utils';

const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

type ActionItemDueDateProps = {
  deadline?: string | null;
  done?: boolean;
  className?: string;
};

const ActionItemDueDate = ({ deadline, done, className }: ActionItemDueDateProps) => {
  if (!deadline) return null;

  const date = new Date(deadline);
  const isOverdue = isActionItemOverdue({ deadline, status: done ? 'DONE' : 'OPEN' });

  if (isOverdue) {
    return (
      <span
        className={cn(
          'rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive',
          className,
        )}
      >
        Overdue · {dateFormatter.format(date)}
      </span>
    );
  }

  return (
    <span className={cn('text-xs font-medium text-muted-foreground', className)}>
      {dateFormatter.format(date)}
    </span>
  );
};

export default ActionItemDueDate;
