import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';
import OverviewTab from './OverviewTab';
import TranscriptTab from './TranscriptTab';
import AttendeesTab from './AttendeesTab';
import AiResultsTab from './AiResultsTab';

type MeetingDialogProps = {
  open: boolean;
  meetingId: string;
  onOpenChange: () => void;
};

const tabTriggerClassName =
  'px-3 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary';

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
            <DialogHeader className="gap-3 border-b border-border/50 p-6">
              <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-center">
                <MeetingStatusBadge status={data.status} />
                <span className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(data.scheduledAt))}
                </span>
              </div>

              <DialogTitle className="text-2xl font-bold">{data.title}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="min-h-0">
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto border-b border-border/50 px-6"
              >
                <TabsTrigger value="overview" className={tabTriggerClassName}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transcript" className={tabTriggerClassName}>
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="ai-results" className={tabTriggerClassName}>
                  AI Results
                </TabsTrigger>
                <TabsTrigger value="attendees" className={tabTriggerClassName}>
                  Attendees
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[55vh] overflow-y-auto p-6">
                <TabsContent value="overview">
                  <OverviewTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="transcript" className="text-sm text-muted-foreground">
                  <TranscriptTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="ai-results" className="text-sm text-muted-foreground">
                  <AiResultsTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="attendees" className="text-sm text-muted-foreground">
                  <AttendeesTab meetingId={meetingId} />
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
