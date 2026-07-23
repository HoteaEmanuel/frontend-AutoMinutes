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
import { useDeleteActionItem } from '@/features/action-items/hooks/useActionItemMutations';
import { BoardActionItem } from '@/features/action-items/utils';

type ActionItemDeleteAlertProps = {
  item: BoardActionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ActionItemDeleteAlert = ({ item, open, onOpenChange }: ActionItemDeleteAlertProps) => {
  const { mutate, isPending } = useDeleteActionItem();

  const handleDelete = () => {
    mutate(
      { meetingId: item.meetingId, actionItemId: item.id },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{item.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action item will be permanently removed. This can&apos;t be undone.
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

export default ActionItemDeleteAlert;
