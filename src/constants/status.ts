import { MeetingStatus } from '@/gql/types';

export const STATUS_LABELS: Record<MeetingStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const STATUSES = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as MeetingStatus,
  label,
}));

export const STATUS_FILTER_ALL = 'ALL';
export const STATUS_FILTER_OPTIONS = [{ value: STATUS_FILTER_ALL, label: 'All' }, ...STATUSES,];

export const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

export const STATUS_STYLES: Record<MeetingStatus, { fill: string; dot: string }> = {
  PENDING: { fill: 'bg-status-pending-soft', dot: 'bg-status-pending' },
  PROCESSING: { fill: 'bg-status-processing-soft', dot: 'bg-status-processing' },
  COMPLETED: { fill: 'bg-status-completed-soft', dot: 'bg-status-completed' },
  FAILED: { fill: 'bg-status-failed-soft', dot: 'bg-status-failed' },
};
