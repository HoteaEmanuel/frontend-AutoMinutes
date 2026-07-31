import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmAlertDialog from '@molecules/ConfirmAlertDialog/ConfirmAlertDialog';
import { useDeleteAccount } from '@/features/user/hooks/useDeleteAccount';
import { getErrorMessage } from '@/lib/errors';
import { toast } from 'sonner';

export const DangerZoneCard = () => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDelete = () => {
    deleteAccount(undefined, {
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Card className="ring-destructive/30">
      <CardContent className="flex h-full flex-col gap-4">
        <h2 className="flex items-center gap-2 text-base font-medium text-destructive">
          <TriangleAlert className="size-4" />
          Danger zone
        </h2>
        <p className="text-sm text-muted-foreground">
          Deleting your account is permanent and can&apos;t be undone. This will remove:
        </p>
        <ul className="flex flex-col gap-1.5 rounded-lg bg-destructive/5 p-3 px-10 text-sm text-muted-foreground items-start list-disc">
          <li>All your meetings and transcripts</li>
          <li>Action items and attendees</li>
          <li>AI-generated summaries and notes</li>
          <li>Your profile, avatar, and login credentials</li>
        </ul>
        <div className="mt-auto flex justify-end">
          <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
            Delete account
          </Button>
        </div>
      </CardContent>

      <ConfirmAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description={
          <>
            This will <span className="font-bold">PERMANENTLY </span> delete your account along with
            all your meetings, transcripts, action items, and attendees.{' '}
            <span className="font-bold">This action cannot be undone.</span>
          </>
        }
        confirmLabel="Delete account"
        pendingLabel="Deleting..."
        isPending={isPending}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default DangerZoneCard;
