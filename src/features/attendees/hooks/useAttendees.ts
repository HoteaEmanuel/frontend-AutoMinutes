import { useQuery } from '@tanstack/react-query';
import { fetchAttendees } from '../api';

export const attendeesKeys = {
  list: (meetingId: string) => ['attendees', meetingId] as const,
};

export const useAttendees = (meetingId: string) =>
  useQuery({
    queryKey: attendeesKeys.list(meetingId),
    queryFn: () => fetchAttendees(meetingId),
    enabled: Boolean(meetingId),
  });
