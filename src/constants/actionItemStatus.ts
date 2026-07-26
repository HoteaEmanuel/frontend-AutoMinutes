export type ActionItemColumnStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export const ACTION_ITEM_COLUMN_LABELS: Record<ActionItemColumnStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

export const ACTION_ITEM_COLUMNS: ActionItemColumnStatus[] = ['OPEN', 'IN_PROGRESS', 'DONE'];
