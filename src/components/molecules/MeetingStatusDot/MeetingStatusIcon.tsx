import { FC } from 'react';
import { CheckCircle2, Clock, Loader2, XCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeetingStatus } from '@/gql/types';
import { STATUS_LABELS } from '@/constants/status';

const STATUS_ICONS: Record<MeetingStatus, { icon: LucideIcon; className: string }> = {
  PENDING: { icon: Clock, className: 'text-status-pending' },
  PROCESSING: { icon: Loader2, className: 'text-status-processing animate-spin' },
  COMPLETED: { icon: CheckCircle2, className: 'text-status-completed' },
  FAILED: { icon: XCircle, className: 'text-status-failed' },
};

interface MeetingStatusIconProps {
  status: MeetingStatus;
  className?: string;
}

const MeetingStatusIcon: FC<MeetingStatusIconProps> = ({ status, className }) => {
  const { icon: Icon, className: statusClassName } = STATUS_ICONS[status];
  const label = STATUS_LABELS[status];

  return (
    <Icon
      role="img"
      aria-label={label}
      className={cn('size-4 shrink-0', statusClassName, className)}
    />
  );
};

export default MeetingStatusIcon;
