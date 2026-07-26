import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import AssigneeAvatar from '@molecules/AssigneeAvatar/AssigneeAvatar';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import { Users } from 'lucide-react';
import AttendeesTabSkeleton from './AttendeesTabSkeleton';

const roleLabels: Record<string, string> = {
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant',
  UNKNOWN: 'Unknown',
};

const AttendeesTab = ({ meetingId }: { meetingId: string }) => {
  const { data: attendees, isError, isPending, refetch, error } = useAttendees(meetingId);

  if (isPending) return <AttendeesTabSkeleton />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (attendees.length === 0)
    return (
      <EmptyState
        icon={Users}
        title="No attendees found"
        description="Attendees will show up here once they're added to this meeting."
        accent="blue"
      />
    );

  return (
    <div className="scrollbar-subtle max-h-[45vh] space-y-1.5 overflow-y-auto">
      {attendees.map((attendee) => (
        <Card
          key={attendee.id}
          className="flex-row items-center gap-3 bg-muted/50 px-4 py-3 ring-0"
        >
          <AssigneeAvatar name={attendee.name} className="data-[size=sm]:size-8" />
          <div className="flex min-w-0 flex-col gap-0">
            <p className="truncate font-medium">{attendee.name}</p>
            {attendee.email && (
              <p className="truncate text-sm text-muted-foreground">{attendee.email}</p>
            )}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {attendee.aiGenerated && <Badge variant="secondary">AI</Badge>}
            <Badge variant="outline">{roleLabels[attendee.role] ?? attendee.role}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AttendeesTab;
