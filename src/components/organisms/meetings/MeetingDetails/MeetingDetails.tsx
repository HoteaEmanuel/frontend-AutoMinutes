import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';
type MeetingDialogProps = {
  open: boolean;
  meetingId: string;
  onOpenChange: () => void;
};
const MeetingDetails = ({ meetingId, open, onOpenChange }: MeetingDialogProps) => {
  const { data, error, isPending, isError, refetch } = useGetMeeting(meetingId);
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (isPending) return <Loader2 className="animate-spin" />;
  return (
    <div className="m-20">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger></DialogTrigger>
        <DialogContent
          className={' flex flex-col md:min-w-xl xl:min-w-7xl max-w-screen  min-h-[95%]'}
        >
          <DialogHeader className="w-full h-fit shrink-0">
            <h2 className="font-bold text-3xl">{data.title}</h2>
            <h2 className="font-bold text-3xl ">{data.status}</h2>
            <p>{new Date(data.scheduledAt).toLocaleString()}</p>
          </DialogHeader>
          <div className="flex flex-1 min-h-0 gap-4 border">
            <div className="w-2/3 min-h-0 overflow-y-auto border">
              <div className="h-1/2 border">Attendess</div>
              <div className="h-1/2 border">Action Items</div>
            </div>

            <Tabs className={'flex flex-1 flex-col min-h-0'} defaultValue={'overview'}>
              <TabsList variant="line">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="ai-result">AI Results</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex-1 min-h-0 overflow-y-auto">
                Description:
                <p>{data.description}</p>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingDetails;
