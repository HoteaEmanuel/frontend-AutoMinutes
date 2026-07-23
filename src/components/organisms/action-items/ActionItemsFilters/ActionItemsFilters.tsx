import FilterCombobox from '@molecules/FilterCombobox/FilterCombobox';

type FilterOption = {
  value: string;
  label: string;
};

type ActionItemsFiltersProps = {
  assignees: string[];
  selectedAssignee: string | null;
  onSelectAssignee: (assignee: string | null) => void;
  meetings: FilterOption[];
  selectedMeetingId: string | null;
  onSelectMeeting: (meetingId: string | null) => void;
};

const ActionItemsFilters = ({
  assignees,
  selectedAssignee,
  onSelectAssignee,
  meetings,
  selectedMeetingId,
  onSelectMeeting,
}: ActionItemsFiltersProps) => (
  <div className="flex flex-wrap items-start gap-4">
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
        options={assignees.map((assignee) => ({ value: assignee, label: assignee }))}
        selectedValue={selectedAssignee}
        onSelect={onSelectAssignee}
        placeholder="Everyone"
        emptyMessage="No assignees found."
      />
    </div>
  </div>
);

export default ActionItemsFilters;
