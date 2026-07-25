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

type RegenerateAIResultsAlertProps = {
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const RegenerateAIResultsAlert = ({
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: RegenerateAIResultsAlertProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Regenerate AI results?</AlertDialogTitle>
        <AlertDialogDescription>
          The current summary, along with every attendee and action item the AI generated for this
          meeting, will be replaced. Anything you added or edited by hand is kept.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" disabled={isPending} onClick={onConfirm}>
          {isPending ? 'Regenerating...' : 'Regenerate'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RegenerateAIResultsAlert;
