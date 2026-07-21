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
import { Meeting } from '@/gql/types';
import MeetingDialog from '@organisms/meetings/MeetingDialog/MeetingDialog';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
