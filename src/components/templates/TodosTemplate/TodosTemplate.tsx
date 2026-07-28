import { useMemo, useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import ActionItemsFilters from '@organisms/action-items/ActionItemsFilters/ActionItemsFilters';
import ActionItemsBoard from '@organisms/action-items/ActionItemsBoard/ActionItemsBoard';
import ActionItemsBoardSkeleton from '@organisms/action-items/ActionItemsBoard/ActionItemsBoardSkeleton';
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

  if (isError)
    return (
      <ErrorRefetch errorMessage={error?.message ?? 'Something went wrong'} refetch={refetchAll} />
    );

  if (isPending)
    return (
      <div className="flex flex-col gap-2 w-full p-2">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
          <Skeleton className="h-7 w-56" />
          <div className="flex flex-wrap items-start gap-4">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <ActionItemsBoardSkeleton />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
        <h1 className="text-lg font-bold">
          {items.length} todo{items.length === 1 ? '' : 's'}{' '}
          {selectedMeetingTitle ? `in "${selectedMeetingTitle}"` : 'across all meetings'}
        </h1>

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

      {items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No todos found"
          description={
            selectedMeetingId || selectedAssigneeId || search
              ? 'Try adjusting your filters to see more todos.'
              : 'Create a todo to start tracking follow-ups.'
          }
          accent="amber"
          className="rounded-xl border border-border bg-card py-16"
        />
      ) : (
        <ActionItemsBoard items={items} />
      )}

      <CreateActionItemDialog
        meetings={meetings}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};

export default TodosTemplate;
