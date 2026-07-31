import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Meeting } from '@/gql/types';
import MeetingRow from '@molecules/MeetingRow/MeetingRow';
import EmptyState from '@molecules/EmptyState/EmptyState';

type TimelineAccent = 'brand' | 'muted';

const ACCENTS: Record<TimelineAccent, { bar: string; glow: string; wash: string }> = {
  brand: {
    bar: 'bg-linear-to-r from-primary via-status-in-progress to-status-done',
    glow: 'bg-linear-to-br from-primary/35 to-status-done/20',
    wash: 'dark:from-primary/5',
  },
  muted: {
    bar: 'bg-linear-to-r from-border via-muted-foreground/40 to-border',
    glow: 'bg-linear-to-br from-muted-foreground/15 to-transparent',
    wash: 'dark:from-muted/50',
  },
};

type MeetingsTimelineCardProps = {
  title: string;
  meetings: Pick<Meeting, 'id' | 'title' | 'scheduledAt' | 'status'>[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  accent?: TimelineAccent;
};

const MeetingsTimelineCard = ({
  title,
  meetings,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  accent = 'brand',
}: MeetingsTimelineCardProps) => {
  const { bar, glow, wash } = ACCENTS[accent];

  return (
    <Card
      className={cn(
        'relative overflow-hidden shadow-sm transition-shadow hover:shadow-md dark:border-transparent dark:bg-linear-to-br dark:via-card dark:to-card',
        wash,
      )}
    >
      <div aria-hidden className={cn('absolute inset-x-0 top-0 hidden h-1 dark:block', bar)} />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-14 -right-14 hidden size-40 rounded-full blur-3xl dark:block',
          glow,
        )}
      />

      <CardContent className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <Link
            to="/meetings"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All meetings
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {meetings.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            className="py-6"
          />
        ) : (
          <div className="flex flex-col gap-1">
            {meetings.map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsTimelineCard;
