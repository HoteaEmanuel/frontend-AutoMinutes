export type ActionItemSortOption = 'title-asc' | 'title-desc' | 'deadline-asc' | 'deadline-desc';

export const ACTION_ITEM_SORT_DEFAULT = 'default' as const;

export const ACTION_ITEM_SORT_OPTIONS: { label: string; value: ActionItemSortOption }[] = [
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
  { label: 'Deadline (Earliest first)', value: 'deadline-asc' },
  { label: 'Deadline (Latest first)', value: 'deadline-desc' },
];
