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

type ReplaceTranscriptAlertProps = {
  fileName: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const ReplaceTranscriptAlert = ({
  fileName,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: ReplaceTranscriptAlertProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Replace transcript?</AlertDialogTitle>
        <AlertDialogDescription>
          A meeting can only have one transcript, so the current one will be permanently replaced
          with "{fileName}". Regenerate the AI results afterwards to reflect the new transcript.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" disabled={isPending} onClick={onConfirm}>
          {isPending ? 'Replacing...' : 'Replace'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ReplaceTranscriptAlert;
