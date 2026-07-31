import { Link } from 'react-router';
import { Meeting } from '@/gql/types';
import { dateFormatter } from '@/features/meetings/columns';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';

type MeetingRowProps = {
  meeting: Pick<Meeting, 'id' | 'title' | 'scheduledAt' | 'status'>;
};

const MeetingRow = ({ meeting }: MeetingRowProps) => (
  <Link
    to={`/meetings/${meeting.id}`}
    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
  >
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-sm font-medium text-foreground">{meeting.title}</span>
      <span className="text-xs tabular-nums text-muted-foreground">
        {dateFormatter.format(new Date(meeting.scheduledAt))}
      </span>
    </div>
    <MeetingStatusBadge status={meeting.status} className="shrink-0" />
  </Link>
);

export default MeetingRow;
