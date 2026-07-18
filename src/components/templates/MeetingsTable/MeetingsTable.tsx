import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { SORT_BY_OPTIONS } from '@/constants/sort';
import { STATUSES } from '@/constants/status';
import { columns } from '@/features/meetings/columns';
import { meetingsQueryOptions, useMeetings } from '@/features/meetings/hooks/useMeetings';
import { MeetingStatus } from '@/gql/types';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import Selector from '@molecules/Selector/Selector';
import { DataTable } from '@organisms/DataTable/DataTable';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
type MeetingsFilters = {
  contentLike: string;
  status: MeetingStatus | undefined;
  scheduledAt: Date | undefined;
  timeAt: string | undefined;
  sortDateOrder: string | undefined;
};

const createScheduleRange = (date: Date | undefined, time: string | undefined) => {
  if (!date) return { scheduledFrom: undefined, scheduledTo: undefined };

  const from = new Date(date);
  const to = new Date(date);

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    from.setHours(hours, minutes, 0, 0);
    to.setHours(hours, minutes + 1, 0, 0);
  } else {
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    to.setDate(to.getDate() + 1);
  }

  return { scheduledFrom: from.toISOString(), scheduledTo: to.toISOString() };
};
const MeetingsTable = () => {
  const queryClient = useQueryClient();
  const [pageNo, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<MeetingsFilters>({
    contentLike: '',
    status: undefined,
    scheduledAt: undefined,
    timeAt: undefined,
    sortDateOrder: undefined,
  });

  const debouncedValue = useDebounce(filters.contentLike, 500, () => setPage(1));
  const { scheduledFrom, scheduledTo } = createScheduleRange(filters.scheduledAt, filters.timeAt);

  const { data, refetch, isPending, isError } = useMeetings({
    pageNo,
    pageSize,
    contentLike: debouncedValue,
    status: filters.status,
    scheduledFrom,
    scheduledTo,
    sortDateOrder: filters.sortDateOrder,
  });

  // Prefetch the next page
  useEffect(() => {
    if (!data) return;
    const hasNextPage = pageNo * pageSize < data.totalCount;
    if (!hasNextPage) return;
    queryClient.prefetchQuery(
      meetingsQueryOptions({
        pageNo: pageNo + 1,
        pageSize,
        contentLike: debouncedValue,
        status: filters.status,
        scheduledFrom,
        scheduledTo,
      }),
    );
  }, [
    data,
    pageNo,
    pageSize,
    debouncedValue,
    filters.status,
    scheduledFrom,
    scheduledTo,
    queryClient,
    filters.sortDateOrder,
  ]);

  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError)
    return (
      <Button onClick={() => refetch()} variant={'destructive'}>
        Something went wrong - Try again
      </Button>
    );

  return (
    <div className="flex flex-col items-center gap-4 w-full overflow-hidden">
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
        <div className="flex flex-col gap-4 justify-center min-w-0 w-1/2">
          <Label>Search</Label>
          <InputGroup className="px-2 py-5">
            <InputGroupInput
              placeholder="Search meetings by title, description..."
              onChange={(e) => setFilters((prev) => ({ ...prev, contentLike: e.target.value }))}
              value={filters.contentLike}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <Selector
            handleChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as MeetingStatus,
              }))
            }
            items={STATUSES}
            value={filters.status as string}
            label={'Status'}
          />
        </div>
        <div className="flex md:w-1/5 items-center">
          <DatePickerTime
            date={filters.scheduledAt}
            time={filters.timeAt}
            setDate={(date: Date | undefined) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                scheduledAt: date,
                timeAt: date ? prev.timeAt : undefined,
              }));
            }}
            setTime={(time: string | undefined) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, timeAt: time }));
            }}
          />
        </div>
        <div className="flex flex-col gap-3 items-center">
          <Selector
            handleChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                sortDateOrder: value ?? 'Newest First',
              }))
            }
            items={SORT_BY_OPTIONS}
            label="Sort"
            value={filters.sortDateOrder as string}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.meetings}
        setPage={(value: number) => setPage(value)}
        setPageSize={(value: number) => setPageSize(value)}
        page={pageNo}
        pageSize={pageSize}
        totalCount={data?.totalCount!}
      />
    </div>
  );
};

export default MeetingsTable;
