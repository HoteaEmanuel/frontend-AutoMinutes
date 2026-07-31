import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import { useDeleteAttendee } from '@/features/attendees/hooks/useAttendeeMutations';
import { Attendee } from '@/gql/types';
import AssigneeAvatar from '@molecules/AssigneeAvatar/AssigneeAvatar';
import AttendeeActionsMenu from '@molecules/AttendeeActionsMenu/AttendeeActionsMenu';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import ConfirmAlertDialog from '@molecules/ConfirmAlertDialog/ConfirmAlertDialog';
import { Plus, Users } from 'lucide-react';
import AttendeesTabSkeleton from './AttendeesTabSkeleton';
import AddAttendeeDialog from './AddAttendeeDialog';
import AttendeeEditDialog from './AttendeeEditDialog';

const roleLabels: Record<string, string> = {
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant',
  UNKNOWN: 'Unknown',
};

const AttendeesTab = ({ meetingId }: { meetingId: string }) => {
  const { data: attendees, isError, isPending, refetch, error } = useAttendees(meetingId);
  const { mutate: deleteAttendee, isPending: isDeleting } = useDeleteAttendee();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [deletingAttendee, setDeletingAttendee] = useState<Attendee | null>(null);

  const handleDeleteAttendee = () => {
    if (!deletingAttendee) return;
    deleteAttendee(
      { attendeeId: deletingAttendee.id },
      { onSuccess: () => setDeletingAttendee(null) },
    );
  };

  if (isPending) return <AttendeesTabSkeleton />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" size="sm" className="self-end" onClick={() => setIsAddOpen(true)}>
        <Plus data-icon="inline-start" />
        Add attendee
      </Button>

      {attendees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No attendees found"
          description="Attendees will show up here once they're added to this meeting."
          accent="blue"
        />
      ) : (
        <div className="scrollbar-subtle max-h-[45vh] space-y-1.5 overflow-y-auto">
          {attendees.map((attendee) => (
            <Card
              key={attendee.id}
              className="flex-row items-center gap-3 bg-muted/50 px-4 py-3 ring-0"
            >
              <AssigneeAvatar name={attendee.name} className="data-[size=sm]:size-8" />
              <div className="flex min-w-0 flex-col gap-0">
                <p className="truncate font-medium">{attendee.name}</p>
                {attendee.email && (
                  <p className="truncate text-sm text-muted-foreground">{attendee.email}</p>
                )}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                {attendee.aiGenerated && <Badge variant="secondary">AI</Badge>}
                <Badge variant="outline">{roleLabels[attendee.role] ?? attendee.role}</Badge>
                <AttendeeActionsMenu
                  onEdit={() => setEditingAttendee(attendee)}
                  onDelete={() => setDeletingAttendee(attendee)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddAttendeeDialog meetingId={meetingId} open={isAddOpen} onOpenChange={setIsAddOpen} />

      {editingAttendee && (
        <AttendeeEditDialog
          attendee={editingAttendee}
          open={!!editingAttendee}
          onOpenChange={(open) => !open && setEditingAttendee(null)}
        />
      )}

      <ConfirmAlertDialog
        open={!!deletingAttendee}
        onOpenChange={(open) => !open && setDeletingAttendee(null)}
        title={
          <>
            Remove "
            <span className="inline-block max-w-[70%] truncate align-bottom">
              {deletingAttendee?.name}
            </span>
            "?
          </>
        }
        description="This attendee will be permanently removed from the meeting. This can't be undone."
        confirmLabel="Remove"
        pendingLabel="Removing..."
        isPending={isDeleting}
        onConfirm={handleDeleteAttendee}
      />
    </div>
  );
};

export default AttendeesTab;
