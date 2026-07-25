import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import { useGetTranscript } from '@/features/meetings/hooks/useTranscript';

const StatCard = ({ value, label }: { value?: number; label: string }) => (
  <div className="rounded-lg border p-4">
    <p className="text-2xl font-bold">{value ?? '—'}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const countWords = (content: string) => content.trim().split(/\s+/).filter(Boolean).length;

const OverviewTab = ({ meetingId }: { meetingId: string }) => {
  const { data: meeting } = useGetMeeting(meetingId);
  const { data: attendees } = useAttendees(meetingId);
  const { data: transcript } = useGetTranscript(meetingId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Description</p>
        <p className="text-sm text-muted-foreground">
          {meeting?.description || 'No description added.'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard value={attendees?.length} label="Attendees" />
        <StatCard value={meeting?.actionItems.length} label="Action items" />
        <StatCard
          value={transcript ? countWords(transcript.content) : undefined}
          label="Transcript words"
        />
      </div>
    </div>
  );
};

export default OverviewTab;
