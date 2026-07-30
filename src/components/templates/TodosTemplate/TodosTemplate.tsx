import { useMemo, useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import DownloadButton from '@atoms/DownloadButton/DownloadButton';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import ActionItemsFilters from '@organisms/action-items/ActionItemsFilters/ActionItemsFilters';
import ActionItemsBoard from '@organisms/action-items/ActionItemsBoard/ActionItemsBoard';
import ActionItemsBoardSkeleton from '@organisms/action-items/ActionItemsBoard/ActionItemsBoardSkeleton';
import CreateActionItemDialog from '@organisms/action-items/CreateActionItemDialog/CreateActionItemDialog';
import { useUserActionItemAssignees, useUserActionItems } from '@/features/action-items/hooks/useActionItems';
import { useActionItemsFilters } from '@/features/action-items/hooks/useActionItemsFilters';
import { useUserMeetingOptions } from '@/features/meetings/hooks/useMeetings';
import { attachMeetingTitles, isActionItemOverdue } from '@/features/action-items/utils';
import { exportBoardActionItemsCsv } from '@/features/export/exportActionItems';
import { getYearScheduleRange, YEAR_FILTER_ALL_TIME } from '@/constants/period';

const TodosTemplate = () => {
  const { filters, setFilters } = useActionItemsFilters();
  const {
    search,
    meetingId: selectedMeetingId,
    assigneeId: selectedAssigneeId,
    onlyMine,
    overdueOnly,
    year: selectedYear,
  } = filters;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const meetingsQuery = useUserMeetingOptions();
  const assigneesQuery = useUserActionItemAssignees();
  const { scheduledFrom, scheduledTo } = useMemo(
    () => getYearScheduleRange(selectedYear),
    [selectedYear],
  );
  const itemsQuery = useUserActionItems({
    meetingId: selectedMeetingId ?? undefined,
    assigneeId: onlyMine ? undefined : selectedAssigneeId ?? undefined,
    search: search || undefined,
    onlyMine: onlyMine || undefined,
    scheduledFrom,
    scheduledTo,
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
  const items = useMemo(() => {
    const withTitles = attachMeetingTitles(itemsQuery.data ?? [], meetingsQuery.data ?? []);
    return overdueOnly ? withTitles.filter(isActionItemOverdue) : withTitles;
  }, [itemsQuery.data, meetingsQuery.data, overdueOnly]);
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
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-32" />
        </div>

        <ActionItemsBoardSkeleton />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold">
          {items.length} todo{items.length === 1 ? '' : 's'}{' '}
          {selectedMeetingTitle
            ? `in "${selectedMeetingTitle}"`
            : selectedYear !== YEAR_FILTER_ALL_TIME
              ? `in ${selectedYear}`
              : 'across all meetings'}
        </h1>

        <DownloadButton
          label="Export CSV"
          disabled={items.length === 0}
          onClick={() => exportBoardActionItemsCsv(items, selectedMeetingTitle)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <ActionItemsFilters
          assignees={assignees}
          selectedAssigneeId={selectedAssigneeId}
          onSelectAssignee={(assigneeId) => setFilters({ assigneeId })}
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          onSelectMeeting={(meetingId) => setFilters({ meetingId })}
          search={search}
          onSearchChange={(value) => setFilters({ search: value })}
          onlyMine={onlyMine}
          onToggleOnlyMine={(value) => setFilters({ onlyMine: value })}
          overdueOnly={overdueOnly}
          onToggleOverdueOnly={(value) => setFilters({ overdueOnly: value })}
          selectedYear={selectedYear}
          onSelectYear={(year) => setFilters({ year })}
        />

        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          Create Todo
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No todos found"
          description={
            selectedMeetingId || selectedAssigneeId || search || onlyMine || overdueOnly
              ? 'Try adjusting your filters to see more todos.'
              : selectedYear !== YEAR_FILTER_ALL_TIME
                ? `No todos found for ${selectedYear}. Switch the period to "All time" to see older todos.`
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
