import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SORT_BY_OPTIONS } from '@/constants/sort';
import { STATUS_FILTER_ALL, STATUS_FILTER_OPTIONS } from '@/constants/status';
import { useMeetingFilters } from '@/features/meetings/hooks/useMeetingFilters';
import { MeetingStatus } from '@/gql/types';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import Selector from '@molecules/Selector/Selector';
import { Funnel, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const MeetingFilters = () => {
  const { filters, setFilters, scheduledAt, timeAt, setScheduledAt, setScheduledTime } =
    useMeetingFilters();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [open, setOpen] = useState(false);

  const debouncedSearch = useDebounce(localSearch, 500);
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const statusSelector = (className?: string) => (
    <Selector
      className={className}
      handleChange={(value) =>
        setFilters({
          status: value === STATUS_FILTER_ALL ? undefined : (value as MeetingStatus),
        })
      }
      items={STATUS_FILTER_OPTIONS}
      value={filters.status ?? STATUS_FILTER_ALL}
      label={'Status'}
    />
  );

  const sortSelector = (className?: string) => (
    <Selector
      className={className}
      handleChange={(value) => setFilters({ sortDateOrder: value ?? 'Newest First' })}
      items={SORT_BY_OPTIONS}
      label="Sort"
      value={filters.sortDateOrder as string}
    />
  );

  const searchInput = (
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
  );

  const hasTodosCheckbox = (
    <Checkbox
      checked={filters.hasTodos ?? false}
      onCheckedChange={(checked) => setFilters({ hasTodos: checked ? true : undefined })}
    />
  );

  return (
    <div className="mb-5 w-full">
      <div className="flex w-full flex-wrap items-center gap-4">
        <div className="hidden min-w-0 max-w-sm flex-1 flex-col justify-center gap-4 md:flex">
          <Label>Search</Label>
          {searchInput}
        </div>
        <div className="hidden shrink-0 items-center md:flex md:w-72">
          <DatePickerTime
            id="desktop-meeting-date"
            date={scheduledAt}
            time={timeAt}
            setDate={setScheduledAt}
            setTime={setScheduledTime}
          />
        </div>
        <div className="hidden flex-col justify-center gap-4 md:flex">
          <Label>Has todos</Label>
          {hasTodosCheckbox}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <div className="md:hidden">
            <DialogTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <Funnel className="size-4" />
                  Filters
                </Button>
              }
            />
          </div>
          <div className="hidden flex-col gap-4 md:ml-auto md:flex">
            <Label className="invisible">Filters</Label>
            <DialogTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <Funnel className="size-4" />
                  Filters
                </Button>
              }
            />
          </div>

          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Search</Label>
                {searchInput}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">{statusSelector('w-full')}</div>
                <div className="flex flex-col gap-2">{sortSelector('w-full')}</div>
              </div>

              <DatePickerTime
                id="modal-meeting-date"
                date={scheduledAt}
                time={timeAt}
                setDate={setScheduledAt}
                setTime={setScheduledTime}
              />

              <div className="flex items-center gap-2">
                {hasTodosCheckbox}
                <Label>Has todos</Label>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeetingFilters;
