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
import MeetingDialog from '@organisms/MeetingDialog/MeetingDialog';

type DataTableProps = {
  data: any;
  columns: any;
  setPage: (page: number) => void;
  setPageSize: (value: number) => void;
  page: number;
  pageSize: number;
  totalCount: number;
};
export function DataTable({
  data,
  columns,
  page,
  pageSize,
  totalCount,
  setPage,
  setPageSize,
}: DataTableProps) {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: totalCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
      setPage(next.pageIndex + 1);
      setPageSize(next.pageSize);
    },
  });

  const handlePageSizeChange = (value: number) => {
    table.setPageSize(value);
  };

  const [meetingSelected, setMeetingSelected] = useState<string | null>(null);
  console.log('MEET SELECT');
  console.log(meetingSelected);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
      <Pagination onPageSizeChange={handlePageSizeChange} table={table} />
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
