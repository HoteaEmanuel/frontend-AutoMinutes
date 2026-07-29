import { ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { ActionItem } from '@/gql/types';
import { BoardActionItem } from '@/features/action-items/utils';
import { buildCsv } from '../csv';

const statusLabel = (status: ActionItem['status']) =>
  (ACTION_ITEM_COLUMN_LABELS as Record<string, string>)[status] ?? status;

const deadlineCell = (deadline: ActionItem['deadline']) =>
  deadline ? new Date(deadline).toISOString().slice(0, 10) : '';

export function buildActionItemsCsv(items: ActionItem[]): string {
  return buildCsv(
    ['Title', 'Description', 'Status', 'Deadline', 'Assignee'],
    items.map((item) => [
      item.title,
      item.description ?? '',
      statusLabel(item.status),
      deadlineCell(item.deadline),
      item.assignee?.name ?? '',
    ]),
  );
}

export function buildBoardActionItemsCsv(items: BoardActionItem[]): string {
  return buildCsv(
    ['Title', 'Description', 'Status', 'Deadline', 'Assignee', 'Meeting'],
    items.map((item) => [
      item.title,
      item.description ?? '',
      statusLabel(item.status),
      deadlineCell(item.deadline),
      item.assignee?.name ?? '',
      item.meetingTitle,
    ]),
  );
}
