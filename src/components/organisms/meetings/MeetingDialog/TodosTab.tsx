import { useMemo, useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import ActionItemCard from '@molecules/ActionItemCard/ActionItemCard';
import CreateActionItemDialog from '@organisms/action-items/CreateActionItemDialog/CreateActionItemDialog';
import { useUserActionItems } from '@/features/action-items/hooks/useActionItems';
import { attachMeetingTitles } from '@/features/action-items/utils';
import TodosTabSkeleton from './TodosTabSkeleton';

type TodosTabProps = {
  meetingId: string;
  meetingTitle: string;
};

const TodosTab = ({ meetingId, meetingTitle }: TodosTabProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data, isError, isPending, refetch, error } = useUserActionItems({ meetingId });

  const items = useMemo(
    () => attachMeetingTitles(data ?? [], [{ id: meetingId, title: meetingTitle }]),
    [data, meetingId, meetingTitle],
  );

  if (isPending) return <TodosTabSkeleton />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" size="sm" className="self-end" onClick={() => setIsCreateOpen(true)}>
        <Plus data-icon="inline-start" />
        Create Todo
      </Button>

      {items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No action items found"
          description="Create a todo to track follow-ups for this meeting."
          accent="amber"
        />
      ) : (
        <div className="scrollbar-subtle max-h-[40vh] space-y-2 overflow-y-auto">
          {items.map((item) => (
            <ActionItemCard key={item.id} item={item} hideMeetingTitle />
          ))}
        </div>
      )}

      <CreateActionItemDialog
        meetingId={meetingId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};

export default TodosTab;
