import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionItemColumnStatus } from '@/constants/actionItemStatus';

type ActionItemStatusIconProps = {
  status: ActionItemColumnStatus;
  className?: string;
};

const statusStyles: Record<ActionItemColumnStatus, string> = {
  OPEN: 'border-status-open bg-transparent',
  IN_PROGRESS: 'border-status-in-progress bg-status-in-progress-soft',
  DONE: 'border-status-done bg-status-done',
};

const ActionItemStatusIcon = ({ status, className }: ActionItemStatusIconProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex size-5 shrink-0 items-center justify-center rounded-md border-2',
      statusStyles[status],
      className,
    )}
  >
    {status === 'DONE' && <Check className="size-3.5 text-white" strokeWidth={3} />}
    {status === 'IN_PROGRESS' && <Minus className="size-3 text-status-in-progress" strokeWidth={3} />}
  </span>
);

export default ActionItemStatusIcon;
