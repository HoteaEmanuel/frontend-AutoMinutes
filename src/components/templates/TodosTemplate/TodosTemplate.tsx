import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import ActionItemsFilters from '@organisms/action-items/ActionItemsFilters/ActionItemsFilters';
import ActionItemsBoard from '@organisms/action-items/ActionItemsBoard/ActionItemsBoard';
import { useActionItemsBoard } from '@/features/action-items/hooks/useActionItemsBoard';
import {
  flattenActionItems,
  getDistinctAssignees,
  getDistinctMeetings,
} from '@/features/action-items/utils';

const TodosTemplate = () => {
  const { data, error, refetch, isPending, isError } = useActionItemsBoard();
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const allItems = useMemo(() => flattenActionItems(data?.meetings ?? []), [data]);
  const assignees = useMemo(() => getDistinctAssignees(allItems), [allItems]);
  const meetings = useMemo(() => getDistinctMeetings(data?.meetings ?? []), [data]);
  const selectedMeetingTitle = meetings.find((meeting) => meeting.value === selectedMeetingId)
    ?.label;
  const filteredItems = useMemo(
    () =>
      allItems
        .filter((item) => selectedAssignee === null || item.assignee?.name === selectedAssignee)
        .filter((item) => selectedMeetingId === null || item.meetingId === selectedMeetingId),
    [allItems, selectedAssignee, selectedMeetingId],
  );

  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError)
    return (
      <ErrorRefetch errorMessage={error?.message ?? 'Something went wrong'} refetch={refetch} />
    );

  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold">Action Items</h1>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length} item{filteredItems.length === 1 ? '' : 's'}{' '}
            {selectedMeetingTitle ? `in "${selectedMeetingTitle}"` : 'across all meetings'} ·
            grouped by status
          </p>
        </div>

        <ActionItemsFilters
          assignees={assignees}
          selectedAssignee={selectedAssignee}
          onSelectAssignee={setSelectedAssignee}
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          onSelectMeeting={setSelectedMeetingId}
        />
      </div>

      <ActionItemsBoard items={filteredItems} />
    </div>
  );
};

export default TodosTemplate;
