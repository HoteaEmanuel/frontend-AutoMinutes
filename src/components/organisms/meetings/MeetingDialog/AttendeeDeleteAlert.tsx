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
import { useDeleteAttendee } from '@/features/attendees/hooks/useAttendeeMutations';
import { Attendee } from '@/gql/types';

type AttendeeDeleteAlertProps = {
  attendee: Attendee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AttendeeDeleteAlert = ({ attendee, open, onOpenChange }: AttendeeDeleteAlertProps) => {
  const { mutate, isPending } = useDeleteAttendee();

  const handleDelete = () => {
    mutate({ attendeeId: attendee.id }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full min-w-0">
            Remove "
            <span className="inline-block max-w-[70%] truncate align-bottom">{attendee.name}</span>
            "?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This attendee will be permanently removed from the meeting. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AttendeeDeleteAlert;
