import { useMemo, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import ActionItemsFilters from '@organisms/action-items/ActionItemsFilters/ActionItemsFilters';
import ActionItemsBoard from '@organisms/action-items/ActionItemsBoard/ActionItemsBoard';
import CreateActionItemDialog from '@organisms/action-items/CreateActionItemDialog/CreateActionItemDialog';
import { useUserActionItemAssignees, useUserActionItems } from '@/features/action-items/hooks/useActionItems';
import { useUserMeetingOptions } from '@/features/meetings/hooks/useMeetings';
import { attachMeetingTitles } from '@/features/action-items/utils';

const TodosTemplate = () => {
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const meetingsQuery = useUserMeetingOptions();
  const assigneesQuery = useUserActionItemAssignees();
  const itemsQuery = useUserActionItems({
    meetingId: selectedMeetingId ?? undefined,
    assigneeId: selectedAssigneeId ?? undefined,
    search: search || undefined,
  });

  const meetings = useMemo(
    () =>
      (meetingsQuery.data ?? [])
        .map((meeting) => ({ value: meeting.id, label: meeting.title }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [meetingsQuery.data],
  );
  const assignees = useMemo(
    () =>
      (assigneesQuery.data ?? [])
        .map((attendee) => ({ value: attendee.id, label: attendee.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [assigneesQuery.data],
  );
  const items = useMemo(
    () => attachMeetingTitles(itemsQuery.data ?? [], meetingsQuery.data ?? []),
    [itemsQuery.data, meetingsQuery.data],
  );
  const selectedMeetingTitle = meetings.find((meeting) => meeting.value === selectedMeetingId)
    ?.label;

  const isPending = itemsQuery.isPending || meetingsQuery.isPending || assigneesQuery.isPending;
  const isError = itemsQuery.isError || meetingsQuery.isError || assigneesQuery.isError;
  const error = itemsQuery.error ?? meetingsQuery.error ?? assigneesQuery.error;

  const refetchAll = () => {
    itemsQuery.refetch();
    meetingsQuery.refetch();
    assigneesQuery.refetch();
  };

  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError)
    return (
      <ErrorRefetch errorMessage={error?.message ?? 'Something went wrong'} refetch={refetchAll} />
    );

  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold">Action Items</h1>
          <p className="text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? '' : 's'}{' '}
            {selectedMeetingTitle ? `in "${selectedMeetingTitle}"` : 'across all meetings'}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <ActionItemsFilters
            assignees={assignees}
            selectedAssigneeId={selectedAssigneeId}
            onSelectAssignee={setSelectedAssigneeId}
            meetings={meetings}
            selectedMeetingId={selectedMeetingId}
            onSelectMeeting={setSelectedMeetingId}
            search={search}
            onSearchChange={setSearch}
          />

          <Button type="button" onClick={() => setIsCreateOpen(true)} className="self-end">
            <Plus data-icon="inline-start" />
            Create Todo
          </Button>
        </div>
      </div>

      <ActionItemsBoard items={items} />

      <CreateActionItemDialog
        meetings={meetings}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};

export default TodosTemplate;
