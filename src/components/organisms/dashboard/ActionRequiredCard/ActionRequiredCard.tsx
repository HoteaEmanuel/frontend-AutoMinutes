import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ActionItemCard from '@molecules/ActionItemCard/ActionItemCard';
import EmptyState from '@molecules/EmptyState/EmptyState';
import { ActionItemUrgency } from '@/features/action-items/utils';
import { UrgentActionItem } from '@/features/dashboard/hooks/useDashboard';

const GROUP_LABELS: Record<ActionItemUrgency, string> = {
  overdue: 'Overdue',
  today: 'Due today',
  week: 'Due this week',
};

const GROUP_ORDER: ActionItemUrgency[] = ['overdue', 'today', 'week'];

type ActionRequiredCardProps = {
  items: UrgentActionItem[];
};

const ActionRequiredCard = ({ items }: ActionRequiredCardProps) => {
  const groups = GROUP_ORDER.map((urgency) => ({
    urgency,
    items: items.filter((item) => item.urgency === urgency),
  })).filter((group) => group.items.length > 0);

  const hasUrgent = items.length > 0;
  const bar = hasUrgent
    ? 'bg-linear-to-r from-destructive via-status-open to-status-open'
    : 'bg-linear-to-r from-status-done via-primary to-status-done';
  const glow = hasUrgent
    ? 'bg-linear-to-br from-destructive/35 to-status-open/20'
    : 'bg-linear-to-br from-status-done/30 to-primary/15';
  const wash = hasUrgent ? 'dark:from-destructive/5' : 'dark:from-status-done/5';

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

      <CardContent className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            Needs your attention
            {items.length > 0 && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                {items.length}
              </span>
            )}
          </h2>
          <Link
            to="/todos?overdueOnly=true"
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all todos
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="You're all caught up"
            description="No overdue or upcoming-due tasks right now."
            accent="emerald"
            className="py-8"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.urgency} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {GROUP_LABELS[group.urgency]}
                </p>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <ActionItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
