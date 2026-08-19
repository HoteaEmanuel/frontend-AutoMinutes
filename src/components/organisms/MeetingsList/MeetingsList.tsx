import { getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';

import Pagination from '@organisms/PaginationSection/Pagination';
import { CalendarSearch, ChevronRight, Clock } from 'lucide-react';
import { Meeting } from '@/gql/types';
import EmptyState from '@molecules/EmptyState/EmptyState';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';
import { STATUS_LABELS, STATUS_STYLES } from '@/constants/status';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';

const dayFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric' });
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
const timeFormatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });

type MeetingsListProps = {
  data: any;
  columns: any;
  totalCount: number;
};

export function MeetingsList({ data, columns, totalCount }: MeetingsListProps) {
  const { filters, setFilters } = useMeetingFilters();
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: totalCount,
    state: {
      pagination: {
        pageIndex: filters.pageNo - 1,
        pageSize: filters.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: filters.pageNo - 1, pageSize: filters.pageSize })
          : updater;
      setFilters({ pageNo: next.pageIndex + 1, pageSize: next.pageSize });
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex max-h-[80vh] w-full flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      {rows.length ? (
        <div className="scrollbar-themed min-h-0 flex-1 divide-y divide-border/60 overflow-y-auto">
          {rows.map((row) => {
            const meeting = row.original as Meeting;
            const scheduledAt = new Date(meeting.scheduledAt);

            return (
              <Link
                key={row.id}
                to={`/meetings/${meeting.id}`}
                className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/60"
              >
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted leading-none">
                    <span className="text-base font-bold text-foreground">
                      {dayFormatter.format(scheduledAt)}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {monthFormatter.format(scheduledAt)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                    <Clock className="size-3" aria-hidden="true" />
                    {timeFormatter.format(scheduledAt)}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium text-foreground">{meeting.title}</span>
                  {meeting.description && (
                    <span className="truncate text-xs text-muted-foreground">
                      {meeting.description}
                    </span>
                  )}
                </div>

                <span
                  role="img"
                  aria-label={STATUS_LABELS[meeting.status]}
                  className={cn(
                    'size-2.5 shrink-0 rounded-full sm:hidden',
                    STATUS_STYLES[meeting.status].dot,
                  )}
                />
                <MeetingStatusBadge status={meeting.status} className="hidden shrink-0 sm:flex" />

                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CalendarSearch}
          title="No meetings found"
          description="Try adjusting your filters or create a new meeting."
          accent="blue"
          className="py-16"
        />
      )}

      <Pagination table={table} />
    </div>
  );
}
