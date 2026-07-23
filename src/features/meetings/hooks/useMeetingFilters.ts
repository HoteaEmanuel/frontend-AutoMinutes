import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { MeetingStatus, PaginatedMeetingsDto } from '@/gql/types';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const createScheduleRange = (date: Date | undefined, time: string | undefined) => {
  if (!date) return { scheduledFrom: undefined, scheduledTo: undefined };

  const from = new Date(date);
  const to = new Date(date);

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    from.setHours(hours, minutes, 0, 0);
    to.setHours(hours, minutes + 1, 0, 0);
  } else {
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    to.setDate(to.getDate() + 1);
  }

  return { scheduledFrom: from.toISOString(), scheduledTo: to.toISOString() };
};

export const useMeetingFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<PaginatedMeetingsDto>(
    () => ({
      pageNo: Number(searchParams.get('pageNo') ?? DEFAULT_PAGE_NO),
      pageSize: Number(searchParams.get('pageSize')) ?? DEFAULT_PAGE_SIZE,
      search: searchParams.get('search') ?? undefined,
      status: (searchParams.get('status') as MeetingStatus) ?? undefined,
      scheduledFrom: searchParams.get('scheduledFrom') ?? undefined,
      scheduledTo: searchParams.get('scheduledTo') ?? undefined,
      sortDateOrder: searchParams.get('sortDateOrder') ?? undefined,
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: Partial<PaginatedMeetingsDto>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(next).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
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

  const scheduledAt = filters.scheduledFrom ? new Date(filters.scheduledFrom) : undefined;
  const scheduledTo = filters.scheduledTo ? new Date(filters.scheduledTo) : undefined;
  const hasExplicitTime =
    !!scheduledAt && !!scheduledTo && scheduledTo.getTime() - scheduledAt.getTime() < ONE_DAY_MS;
  const timeAt = hasExplicitTime
    ? `${String(scheduledAt!.getHours()).padStart(2, '0')}:${String(scheduledAt!.getMinutes()).padStart(2, '0')}`
    : undefined;

  const setScheduledAt = useCallback(
    (date: Date | undefined) => {
      setFilters(createScheduleRange(date, date ? timeAt : undefined));
    },
    [setFilters, timeAt],
  );

  const setScheduledTime = useCallback(
    (time: string | undefined) => {
      setFilters(createScheduleRange(scheduledAt, time));
    },
    [setFilters, scheduledAt],
  );

  return { filters, setFilters, scheduledAt, timeAt, setScheduledAt, setScheduledTime };
};
