import { ActionItem, ActionItemStatus, Meeting } from '@/gql/types';
import { ActionItemColumnStatus } from '@/constants/actionItemStatus';

export interface BoardActionItem extends ActionItem {
  meetingTitle: string;
}

export const flattenActionItems = (meetings: Pick<Meeting, 'id' | 'title' | 'actionItems'>[]): BoardActionItem[] =>
  meetings.flatMap((meeting) =>
    meeting.actionItems.map((item) => ({
      ...item,
      meetingTitle: meeting.title,
    })),
  );

export const getDistinctAssignees = (items: BoardActionItem[]): string[] => {
  const names = new Set(
    items.map((item) => item.assignee?.name).filter((name): name is string => Boolean(name)),
  );
  return Array.from(names).sort((a, b) => a.localeCompare(b));
};

export const getDistinctMeetings = (
  meetings: Pick<Meeting, 'id' | 'title'>[],
): { value: string; label: string }[] =>
  meetings
    .map((meeting) => ({ value: meeting.id, label: meeting.title }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const resolveColumnStatus = (status: ActionItemStatus): ActionItemColumnStatus =>
  status === 'UNKNOWN' ? 'OPEN' : status;
