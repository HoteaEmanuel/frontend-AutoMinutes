import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { SORT_BY_OPTIONS } from '@/constants/sort';
import { STATUSES } from '@/constants/status';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';
import { MeetingStatus } from '@/gql/types';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import Selector from '@molecules/Selector/Selector';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const MeetingFilters = () => {
  const { filters, setFilters, scheduledAt, timeAt, setScheduledAt, setScheduledTime } =
    useMeetingFilters();

  const [localSearch, setLocalSearch] = useState(filters.search);

  const debouncedSearch = useDebounce(localSearch, 500);
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
      <div className="flex flex-col gap-4 justify-center min-w-0 w-1/2">
        <Label>Search</Label>
        <InputGroup className="px-2 py-5">
          <InputGroupInput
            placeholder="Search meetings by title, description..."
            onChange={(e) => setLocalSearch(e.target.value)}
            value={filters.search as string}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <Selector
          handleChange={(value) =>
            setFilters({
              status: value as MeetingStatus,
            })
          }
          items={STATUSES}
          value={filters.status as string}
          label={'Status'}
        />
      </div>
      <div className="flex md:w-1/5 items-center">
        <DatePickerTime
          date={scheduledAt}
          time={timeAt}
          setDate={setScheduledAt}
          setTime={setScheduledTime}
        />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <Selector
          handleChange={(value) => setFilters({ sortDateOrder: value ?? 'Newest First' })}
          items={SORT_BY_OPTIONS}
          label="Sort"
          value={filters.sortDateOrder as string}
        />
      </div>
    </div>
  );
};

export default MeetingFilters;
