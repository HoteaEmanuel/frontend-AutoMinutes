import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SKELETON_ROW_COUNT = 6;

export function DataTableSkeleton() {
  return (
    <div className="flex flex-col max-h-[70vh] rounded-lg border border-border bg-card text-card-foreground shadow-sm w-full">
      <Table containerClassName="flex-1 min-h-0 scrollbar-themed">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 z-10 bg-table-header-bg rounded-sm">
              Title
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-table-header-bg rounded-sm">
              Date &amp; Time
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-table-header-bg rounded-sm">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            <TableRow key={index} className={`h-16 ${index % 2 ? 'bg-table-row-odd' : ''}`}>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-4xl" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
