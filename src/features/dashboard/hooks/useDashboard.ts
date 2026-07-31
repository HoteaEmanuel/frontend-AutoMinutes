import { useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { useMeetings, useUserMeetingOptions } from '@/features/meetings/hooks/useMeetings';
import { useUserActionItems } from '@/features/action-items/hooks/useActionItems';
import {
  attachMeetingTitles,
  getActionItemUrgency,
  type ActionItemUrgency,
  type BoardActionItem,
} from '@/features/action-items/utils';

const UPCOMING_LIMIT = 5;
const RECENT_LIMIT = 5;
const URGENT_LIMIT = 6;

const URGENCY_RANK: Record<ActionItemUrgency, number> = { overdue: 0, today: 1, week: 2 };

export type UrgentActionItem = BoardActionItem & { urgency: ActionItemUrgency };

export const useDashboard = () => {
  const todayStart = useMemo(() => startOfDay(new Date()).toISOString(), []);

  const upcomingQuery = useMeetings({
    pageNo: 1,
    pageSize: UPCOMING_LIMIT,
    scheduledFrom: todayStart,
    sortDateOrder: 'Oldest First',
  });
  const recentQuery = useMeetings({
    pageNo: 1,
    pageSize: RECENT_LIMIT,
    scheduledTo: todayStart,
    sortDateOrder: 'Newest First',
  });
  const actionItemsQuery = useUserActionItems({});
  const meetingOptionsQuery = useUserMeetingOptions();

  const urgentItems = useMemo<UrgentActionItem[]>(() => {
    if (!actionItemsQuery.data || !meetingOptionsQuery.data) return [];

    const now = new Date();
    const withTitles = attachMeetingTitles(actionItemsQuery.data, meetingOptionsQuery.data);

    return withTitles
      .map((item) => ({ item, urgency: getActionItemUrgency(item, now) }))
      .filter(
        (entry): entry is { item: BoardActionItem; urgency: ActionItemUrgency } =>
          entry.urgency !== null,
      )
      .sort((a, b) => {
        const rankDiff = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency];
        if (rankDiff !== 0) return rankDiff;
        // Safe: urgency is only non-null when deadline is set.
        return new Date(a.item.deadline!).getTime() - new Date(b.item.deadline!).getTime();
      })
      .slice(0, URGENT_LIMIT)
      .map(({ item, urgency }) => ({ ...item, urgency }));
  }, [actionItemsQuery.data, meetingOptionsQuery.data]);

  const isPending =
    upcomingQuery.isPending ||
    recentQuery.isPending ||
    actionItemsQuery.isPending ||
    meetingOptionsQuery.isPending;
  const isError =
    upcomingQuery.isError ||
    recentQuery.isError ||
    actionItemsQuery.isError ||
    meetingOptionsQuery.isError;
  const error =
    upcomingQuery.error ?? recentQuery.error ?? actionItemsQuery.error ?? meetingOptionsQuery.error;

  const refetch = () => {
    upcomingQuery.refetch();
    recentQuery.refetch();
    actionItemsQuery.refetch();
    meetingOptionsQuery.refetch();
  };

  return {
    urgentItems,
    upcoming: upcomingQuery.data?.meetings ?? [],
    recent: recentQuery.data?.meetings ?? [],
    isPending,
    isError,
    error,
    refetch,
  };
};
