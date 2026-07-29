import { FileText, ListChecks, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CountUp } from '@/lib/countup';
import { cn } from '@/lib/utils';
import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import { useGetTranscript } from '@/features/meetings/hooks/useTranscript';

type StatAccent = 'blue' | 'amber' | 'emerald';

const accentStyles: Record<StatAccent, string> = {
  blue: 'bg-status-in-progress-soft text-status-in-progress',
  amber: 'bg-status-open-soft text-status-open',
  emerald: 'bg-status-done-soft text-status-done',
};

const StatCard = ({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Users;
  value?: number;
  label: string;
  accent: StatAccent;
}) => (
  <Card>
    <CardContent className="flex items-center gap-3">
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl',
          accentStyles[accent],
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-semibold leading-none tabular-nums">
          {value !== undefined ? <CountUp end={value} duration={1.2} separator="," /> : '—'}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
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
        <StatCard icon={Users} value={attendees?.length} label="Attendees" accent="blue" />
        <StatCard
          icon={ListChecks}
          value={meeting?.actionItems.length}
          label="Action items"
          accent="amber"
        />
        <StatCard
          icon={FileText}
          value={transcript ? countWords(transcript.content) : undefined}
          label="Transcript words"
          accent="emerald"
        />
      </div>
    </div>
  );
};

export default OverviewTab;
