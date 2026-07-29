import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MeetingStatus } from '@/gql/types';
import { STATUS_LABELS, STATUS_STYLES } from '@/constants/status';

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
  className?: string;
}

const MeetingStatusBadge: FC<MeetingStatusBadgeProps> = ({ status, className }) => {
  const { fill, dot } = STATUS_STYLES[status];
  const label = STATUS_LABELS[status];

  return (
    <Badge variant="outline" className={cn('gap-1.5 border-transparent text-foreground', fill, className)}>
      <span className={cn('size-1.5 shrink-0 rounded-full', dot)} aria-hidden="true" />
      {label}
    </Badge>
  );
};

export default MeetingStatusBadge;
