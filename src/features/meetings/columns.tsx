import { ColumnDef } from '@tanstack/react-table';
import { Meeting } from '@/gql/types';
import MeetingStatusBadge from '../../components/molecules/MeetingStatusBadge/MeetingStatusBadge';

export const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="max-w-100 truncate font-medium text-foreground">
          {row.original.title}
        </span>
        {row.original.description && (
          <span className="max-w-100 truncate text-xs text-muted-foreground">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Date & Time',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {dateFormatter.format(new Date(row.original.scheduledAt))}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <MeetingStatusBadge status={row.original.status} />,
  },
];
