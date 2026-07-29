import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@organisms/PaginationSection/Pagination';
import { useState } from 'react';
import { CalendarSearch } from 'lucide-react';
import { Meeting } from '@/gql/types';
import MeetingDialog from '@organisms/meetings/MeetingDialog/MeetingDialog';
import EmptyState from '@molecules/EmptyState/EmptyState';
import MeetingStatusIcon from '@molecules/MeetingStatusDot/MeetingStatusIcon';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { dateFormatter } from '@/features/meetings/columns';

type DataTableProps = {
  data: any;
  columns: any;
  totalCount: number;
};
export function DataTable({ data, columns, totalCount }: DataTableProps) {
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

  const [meetingSelected, setMeetingSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col max-h-[70vh] rounded-lg border border-border bg-card text-card-foreground shadow-sm w-full">
      <div className="hidden md:flex md:min-h-0 md:flex-1 md:flex-col">
        <Table containerClassName="flex-1 min-h-0 scrollbar-themed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="sticky top-0 z-10 bg-table-header-bg rounded-sm"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`h-16 cursor-pointer ${index % 2 ? 'bg-table-row-odd' : ''}`}
                  onClick={() => setMeetingSelected((row.original as Meeting).id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <Tooltip>
                        <TooltipTrigger render={<span className="block" />}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TooltipTrigger>
                        <TooltipContent>View meeting details</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-64">
                  <EmptyState
                    icon={CalendarSearch}
                    title="No meetings found"
                    description="Try adjusting your filters or create a new meeting."
                    accent="blue"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, index) => {
            const meeting = row.original as Meeting;
            return (
              <div
                key={row.id}
                className={`flex cursor-pointer items-center justify-between gap-3 border-b border-b-table-row-border px-4 py-3 last:border-b-0 ${index % 2 ? 'bg-table-row-odd' : ''}`}
                onClick={() => setMeetingSelected(meeting.id)}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  <span className="truncate font-medium text-foreground">{meeting.title}</span>
                  {meeting.description && (
                    <span className="truncate text-xs text-muted-foreground">
                      {meeting.description}
                    </span>
                  )}
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {dateFormatter.format(new Date(meeting.scheduledAt))}
                  </span>
                </div>
                <MeetingStatusIcon status={meeting.status} />
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={CalendarSearch}
            title="No meetings found"
            description="Try adjusting your filters or create a new meeting."
            accent="blue"
            className="py-16"
          />
        )}
      </div>

      <Pagination table={table} />
      {meetingSelected && (
        <MeetingDialog
          meetingId={meetingSelected}
          open={true}
          onOpenChange={() => setMeetingSelected(null)}
        />
      )}
    </div>
  );
}
