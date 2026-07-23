import { ActionItem, ActionItemStatus, Meeting } from '@/gql/types';
import { ActionItemColumnStatus } from '@/constants/actionItemStatus';
import { ActionItemSortOption } from '@/constants/actionItemSort';

export interface BoardActionItem extends ActionItem {
  meetingTitle: string;
}

export const attachMeetingTitles = (
  items: ActionItem[],
  meetings: Pick<Meeting, 'id' | 'title'>[],
): BoardActionItem[] => {
  const titleByMeetingId = new Map(meetings.map((meeting) => [meeting.id, meeting.title]));
  return items.map((item) => ({
    ...item,
    meetingTitle: titleByMeetingId.get(item.meetingId) ?? 'Unknown meeting',
  }));
};

export const resolveColumnStatus = (status: ActionItemStatus): ActionItemColumnStatus =>
  status === 'UNKNOWN' ? 'OPEN' : status;

export const sortActionItems = <T extends BoardActionItem>(
  items: T[],
  sort: ActionItemSortOption | null,
): T[] => {
  if (!sort) return items;

  const [field, direction] = sort.split('-') as ['title' | 'deadline', 'asc' | 'desc'];
  const sign = direction === 'asc' ? 1 : -1;

  return [...items].sort((a, b) => {
    if (field === 'title') return a.title.localeCompare(b.title) * sign;

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * sign;
  });
};
