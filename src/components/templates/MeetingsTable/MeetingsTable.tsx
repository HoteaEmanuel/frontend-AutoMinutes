import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { STATUS } from '@/constants/status';
import { columns } from '@/features/meetings/columns';
import { meetingsQueryOptions, useMeetings } from '@/features/meetings/hooks/useMeetings';
import { Meeting, MeetingStatus } from '@/gql/types';
import { useDebounce } from '@/hooks/useDebounce';
import StatusSelect from '@molecules/StatusSelect/StatusSelect';
import { DataTable } from '@organisms/DataTable/DataTable';
import { useQueryClient } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MeetingsTable = () => {
  console.log('COMP RERENDERED');
  const queryClient = useQueryClient();
  const [pageNo, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    contentLike: '',
    status: '',
  });

  const debouncedValue = useDebounce(filters.contentLike, 500, () => setPage(1));
  const { data, error, refetch, isPending, isError } = useMeetings({
    pageNo,
    pageSize,
    contentLike: debouncedValue,
    status: filters.status,
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
      }),
    );
  }, [data, pageNo, pageSize, debouncedValue, filters.status, queryClient]);

  if (isPending) return <p>Loading...</p>;
  if (!data) return null;

  console.log('FILTERS: ', filters);
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex items-center gap-4">
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

        <StatusSelect
          status={filters.status as MeetingStatus}
          setStatus={(value) => {
            setPage(1);
            setFilters((prev) => ({
              ...prev,
              status: value,
            }));
          }}
        />
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
