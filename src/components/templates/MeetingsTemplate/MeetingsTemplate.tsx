import { PAGINATION_SIZE_OPTIONS } from '@/constants/pagination';
import { SORTING_AVAILABLE } from '@/constants/sort';
import { STATUS_OPTIONS } from '@/constants/status';
import { columns } from '@/features/meetings/columns';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';
import { meetingsQueryOptions, useMeetings } from '@/features/meetings/hooks/useMeetings';
import { useExportMeetings } from '@/features/export/hooks/useExportMeetings';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { DataTable } from '@organisms/DataTable/DataTable';
import { DataTableSkeleton } from '@organisms/DataTable/DataTableSkeleton';
import MeetingFilters from '@organisms/meetings/MeetingFilters/MeetingFilters';
import DownloadButton from '@atoms/DownloadButton/DownloadButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileJson, FileSpreadsheet } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const MeetingsTemplate = () => {
  const queryClient = useQueryClient();
  const { exportMeetings, isExporting } = useExportMeetings();

  const { filters, setFilters } = useMeetingFilters();
  const { pageNo, pageSize, scheduledFrom, scheduledTo, search, sortDateOrder, status, hasTodos } =
    filters;

  const { data, error, refetch, isPending, isError } = useMeetings({
    pageNo,
    pageSize,
    search,
    status,
    scheduledFrom,
    scheduledTo,
    sortDateOrder,
    hasTodos,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / pageSize)) : undefined;
  const exceedesMaxPage = !!totalPages && pageNo > totalPages;
  const validStatus = STATUS_OPTIONS.includes(status as string) || !status;
  const validSort = SORTING_AVAILABLE.includes(sortDateOrder ?? '') || !sortDateOrder;

  // Validare pageNo + pageSize + status + sort options

  useEffect(() => {
    if (exceedesMaxPage) setFilters({ pageNo: totalPages });
    if (pageNo < 1) setFilters({ pageNo: 1 });
    if (!validStatus) setFilters({ status: undefined });
    if (!validSort) setFilters({ sortDateOrder: undefined });
    if (!PAGINATION_SIZE_OPTIONS.includes(pageSize)) {
      setFilters({ pageSize: PAGINATION_SIZE_OPTIONS[0] });
    }
  }, [exceedesMaxPage, totalPages, pageSize, setFilters]);

  // Prefetch the next page
  useEffect(() => {
    if (!data) return;
    const hasNextPage = pageNo * pageSize < data.totalCount;
    if (!hasNextPage) return;
    queryClient.prefetchQuery(
      meetingsQueryOptions({
        pageNo: pageNo + 1,
        pageSize,
        search,
        status,
        scheduledFrom,
        scheduledTo,
        sortDateOrder,
        hasTodos,
      }),
    );
  }, [
    data,
    pageNo,
    pageSize,
    search,
    status,
    scheduledFrom,
    scheduledTo,
    sortDateOrder,
    hasTodos,
    queryClient,
  ]);

  if (isError)
    return (
      <ErrorRefetch errorMessage={error?.message ?? 'Something went wrong'} refetch={refetch} />
    );

  const showSkeleton =
    isPending || exceedesMaxPage || pageNo < 1 || !validStatus || !validSort;

  return (
    <div className="flex flex-col items-center gap-1 w-full p-2">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-left text-2xl font-bold">Meetings</h1>

        <DropdownMenu>
          <DropdownMenuTrigger render={<DownloadButton label="Export" loading={isExporting} />} />
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem onClick={() => exportMeetings('csv')}>
              <FileSpreadsheet />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportMeetings('json')}>
              <FileJson />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MeetingFilters />
      {showSkeleton ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} data={data?.meetings} totalCount={data?.totalCount!} />
      )}
    </div>
  );
};

export default MeetingsTemplate;
