import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';
import FilterCombobox from '@molecules/FilterCombobox/FilterCombobox';

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
};

const ActionItemsFilters = ({
  assignees,
  selectedAssigneeId,
  onSelectAssignee,
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  search,
  onSearchChange,
}: ActionItemsFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Search</span>
        <InputGroup className="px-2 py-5">
          <InputGroupInput
            placeholder="Search by title, description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Meeting</span>
        <FilterCombobox
          options={meetings}
          selectedValue={selectedMeetingId}
          onSelect={onSelectMeeting}
          placeholder="All meetings"
          emptyMessage="No meetings found."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Assignee</span>
        <FilterCombobox
          options={assignees}
          selectedValue={selectedAssigneeId}
          onSelect={onSelectAssignee}
          placeholder="Everyone"
          emptyMessage="No assignees found."
        />
      </div>
    </div>
  );
};

export default ActionItemsFilters;
