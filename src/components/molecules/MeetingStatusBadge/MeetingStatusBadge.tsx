import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MeetingStatus } from '@/gql/types';
import { STATUS_LABELS } from '@/constants/status';

const statusStyles: Record<MeetingStatus, { fill: string; dot: string }> = {
  PENDING: {
    fill: 'bg-status-pending-soft',
    dot: 'bg-status-pending',
  },
  PROCESSING: {
    fill: 'bg-status-processing-soft',
    dot: 'bg-status-processing',
  },
  COMPLETED: {
    fill: 'bg-status-completed-soft',
    dot: 'bg-status-completed',
  },
  FAILED: {
    fill: 'bg-status-failed-soft',
    dot: 'bg-status-failed',
  },
};

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
  className?: string;
}

const MeetingStatusBadge: FC<MeetingStatusBadgeProps> = ({ status, className }) => {
  const { fill, dot } = statusStyles[status];
  const label = STATUS_LABELS[status];

  return (
    <Badge variant="outline" className={cn('gap-1.5 border-transparent text-foreground', fill, className)}>
      <span className={cn('size-1.5 shrink-0 rounded-full', dot)} aria-hidden="true" />
      {label}
    </Badge>
  );
};

export default MeetingStatusBadge;
