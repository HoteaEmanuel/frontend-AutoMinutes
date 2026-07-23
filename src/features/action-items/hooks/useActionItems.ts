import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ActionItemsFilterDto } from '@/gql/types';
import { fetchUserActionItemAssignees, fetchUserActionItems } from '../api';

export const actionItemsKeys = {
  all: ['action-items'] as const,
  list: (filter: ActionItemsFilterDto) => ['action-items', 'list', filter] as const,
  assignees: ['action-items', 'assignees'],
};

export const useUserActionItems = (filter: ActionItemsFilterDto) =>
  useQuery({
    queryKey: actionItemsKeys.list(filter),
    queryFn: () => fetchUserActionItems(filter),
    placeholderData: keepPreviousData,
  });

export const useUserActionItemAssignees = () =>
  useQuery({
    queryKey: actionItemsKeys.assignees,
    queryFn: fetchUserActionItemAssignees,
  });
