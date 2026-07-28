import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteMeeting } from '@/features/meetings/hooks/useMeetings';

type MeetingDeleteAlertProps = {
  meetingId: string;
  meetingTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

const MeetingDeleteAlert = ({
  meetingId,
  meetingTitle,
  open,
  onOpenChange,
  onDeleted,
}: MeetingDeleteAlertProps) => {
  const { mutate, isPending } = useDeleteMeeting();

  const handleDelete = () => {
    mutate(meetingId, {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full min-w-0">
            Delete "
            <span className="inline-block max-w-[70%] truncate align-bottom">{meetingTitle}</span>
            "?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the meeting along with its transcript, AI results,
            attendees, and action items. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MeetingDeleteAlert;
