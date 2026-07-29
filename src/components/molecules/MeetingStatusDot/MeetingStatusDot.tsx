import { FC } from 'react';
import { cn } from '@/lib/utils';
import { MeetingStatus } from '@/gql/types';
import { STATUS_LABELS, STATUS_STYLES } from '@/constants/status';

interface MeetingStatusDotProps {
  status: MeetingStatus;
  className?: string;
}

const MeetingStatusDot: FC<MeetingStatusDotProps> = ({ status, className }) => {
  const { dot } = STATUS_STYLES[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn('inline-block size-2.5 shrink-0 rounded-full', dot, className)}
    />
  );
};

export default MeetingStatusDot;
