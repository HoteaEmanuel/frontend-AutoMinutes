import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export type ActionItemsFilterState = {
  search: string;
  meetingId: string | null;
  assigneeId: string | null;
  onlyMine: boolean;
  year: string;
};

export const useActionItemsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ActionItemsFilterState>(
    () => ({
      search: searchParams.get('search') ?? '',
      meetingId: searchParams.get('meetingId'),
      assigneeId: searchParams.get('assigneeId'),
      onlyMine: searchParams.get('onlyMine') === 'true',
      year: searchParams.get('year') ?? String(new Date().getFullYear()),
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: Partial<ActionItemsFilterState>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(next).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '' || value === false) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        return params;
      });
    },
    [setSearchParams],
  );

  return { filters, setFilters };
};
