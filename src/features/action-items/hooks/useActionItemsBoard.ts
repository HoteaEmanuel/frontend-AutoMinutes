import { useQuery } from '@tanstack/react-query';
import { fetchActionItemsBoard } from '../api';

const BOARD_PAGE_SIZE = 100;

export const actionItemsKeys = {
  board: ['action-items', 'board'] as const,
};

export const useActionItemsBoard = () =>
  useQuery({
    queryKey: actionItemsKeys.board,
    queryFn: () => fetchActionItemsBoard({ pageNo: 1, pageSize: BOARD_PAGE_SIZE }),
  });
