import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';

type MeetingDialogProps = {
  open: boolean;
  meetingId: string;
  onOpenChange: () => void;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const MeetingDialog = ({ meetingId, open, onOpenChange }: MeetingDialogProps) => {
  const { data, error, isPending, isError, refetch } = useGetMeeting(meetingId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {isPending && (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {isError && (
          <div className="p-6">
            <ErrorRefetch errorMessage={error.message} refetch={refetch} />
          </div>
        )}

        {data && (
          <>
            <DialogHeader className="gap-3 border-b p-6">
              <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-center">
                <MeetingStatusBadge status={data.status} />
                <span className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(data.scheduledAt))}
                </span>
              </div>

              <DialogTitle className="text-2xl font-bold">{data.title}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="min-h-0">
              <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b px-6">
                <TabsTrigger value="overview" className="px-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transcript" className="px-3">
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="ai-results" className="px-3">
                  AI Results
                </TabsTrigger>
                <TabsTrigger value="attendees" className="px-3">
                  Attendees
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[55vh] overflow-y-auto p-6">
                <TabsContent value="overview" className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.description || 'No description added.'}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Attendees</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Action items</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Transcript words</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transcript" className="text-sm text-muted-foreground">
                  Transcript details will be added here.
                </TabsContent>

                <TabsContent value="ai-results" className="text-sm text-muted-foreground">
                  AI results will be added here.
                </TabsContent>

                <TabsContent value="attendees" className="text-sm text-muted-foreground">
                  Attendees will be added here.
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDialog;
