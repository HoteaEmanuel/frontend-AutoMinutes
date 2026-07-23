import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGetAttendees } from '@/features/attendees/hooks/useAttendees';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';

const roleLabels: Record<string, string> = {
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant',
  UNKNOWN: 'Unknown',
};

const AttendeesTab = ({ meetingId }: { meetingId: string }) => {
  const { data: attendees, isError, isPending, refetch, error } = useGetAttendees(meetingId);
  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (attendees.length === 0)
    return <p className="text-center font-semibold">No attendees found</p>;

  return (
    <div className="flex flex-col gap-3">
      {attendees.map((attendee) => (
        <Card
          key={attendee.email ?? attendee.name}
          className="flex-row items-center justify-between px-4"
        >
          <div className="flex flex-col gap-0.5">
            <p className="font-medium">{attendee.name}</p>
            {attendee.email && <p className="text-sm text-muted-foreground">{attendee.email}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {attendee.aiGenerated && <Badge variant="secondary">AI</Badge>}
            <Badge variant="outline">{roleLabels[attendee.role] ?? attendee.role}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AttendeesTab;
