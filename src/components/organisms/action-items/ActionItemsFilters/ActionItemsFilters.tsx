import { useEffect, useState } from 'react';
import { Funnel, SearchIcon } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import { getYearFilterOptions, YEAR_FILTER_ALL_TIME } from '@/constants/period';
import FilterCombobox from '@molecules/FilterCombobox/FilterCombobox';
import Selector from '@molecules/Selector/Selector';

type FilterOption = {
  value: string;
  label: string;
};

type ActionItemsFiltersProps = {
  assignees: FilterOption[];
  selectedAssigneeId: string | null;
  onSelectAssignee: (assigneeId: string | null) => void;
  meetings: FilterOption[];
  selectedMeetingId: string | null;
  onSelectMeeting: (meetingId: string | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onlyMine: boolean;
  onToggleOnlyMine: (onlyMine: boolean) => void;
  overdueOnly: boolean;
  onToggleOverdueOnly: (overdueOnly: boolean) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
};

const yearOptions = getYearFilterOptions();

const ActionItemsFilters = ({
  assignees,
  selectedAssigneeId,
  onSelectAssignee,
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  search,
  onSearchChange,
  onlyMine,
  onToggleOnlyMine,
  overdueOnly,
  onToggleOverdueOnly,
  selectedYear,
  onSelectYear,
}: ActionItemsFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  const searchInput = (className?: string) => (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder="Search by title, description..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );

  const meetingCombobox = (className?: string) => (
    <FilterCombobox
      className={className}
      options={meetings}
      selectedValue={selectedMeetingId}
      onSelect={onSelectMeeting}
      placeholder="All meetings"
      emptyMessage="No meetings found."
    />
  );

  const assigneeCombobox = (className?: string) => (
    <FilterCombobox
      className={className}
      options={assignees}
      selectedValue={selectedAssigneeId}
      onSelect={onSelectAssignee}
      placeholder="Everyone"
      emptyMessage="No assignees found."
      disabled={onlyMine}
    />
  );

  const onlyMineCheckbox = (
    <Checkbox id="only-mine-filter" checked={onlyMine} onCheckedChange={onToggleOnlyMine} />
  );

  const overdueOnlyCheckbox = (
    <Checkbox id="overdue-only-filter" checked={overdueOnly} onCheckedChange={onToggleOverdueOnly} />
  );

  const yearSelector = (className?: string) => (
    <Selector
      className={className}
      items={yearOptions}
      value={selectedYear}
      label="Period"
      handleChange={(value) => onSelectYear(value ?? YEAR_FILTER_ALL_TIME)}
    />
  );

  return (
    <>
      <div className="hidden items-start gap-3 md:flex">
        <div className="flex flex-none flex-col gap-1.5">{yearSelector()}</div>

        <div className="flex min-w-24 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Search</span>
          {searchInput('w-full')}
        </div>

        <div className="flex min-w-20 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Meeting</span>
          {meetingCombobox('w-full')}
        </div>

        <div className="flex min-w-20 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Assignee</span>
          {assigneeCombobox('w-full')}
        </div>

        <div className="flex flex-none flex-col gap-1.5">
          <span className="invisible text-xs font-medium text-muted-foreground">Only mine</span>
          <Label htmlFor="only-mine-filter" className="h-8 cursor-pointer whitespace-nowrap">
            {onlyMineCheckbox}
            Only my tasks
          </Label>
        </div>

        <div className="flex flex-none flex-col gap-1.5">
          <span className="invisible text-xs font-medium text-muted-foreground">Overdue only</span>
          <Label htmlFor="overdue-only-filter" className="h-8 cursor-pointer whitespace-nowrap">
            {overdueOnlyCheckbox}
            Overdue only
          </Label>
        </div>
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

        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">{yearSelector('w-full')}</div>

            <div className="flex flex-col gap-2">
              <Label>Search</Label>
              {searchInput('w-full')}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Meeting</Label>
              {meetingCombobox('w-full')}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Assignee</Label>
              {assigneeCombobox('w-full')}
            </div>

            <Label htmlFor="only-mine-filter-modal" className="flex items-center gap-2">
              <Checkbox
                id="only-mine-filter-modal"
                checked={onlyMine}
                onCheckedChange={onToggleOnlyMine}
              />
              Only my tasks
            </Label>

            <Label htmlFor="overdue-only-filter-modal" className="flex items-center gap-2">
              <Checkbox
                id="overdue-only-filter-modal"
                checked={overdueOnly}
                onCheckedChange={onToggleOverdueOnly}
              />
              Overdue only
            </Label>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionItemsFilters;
