import { useQuery } from '@tanstack/react-query';
import { findAttendess } from '../api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';

export const useGetAttendees = (meetingId: string) =>
  useQuery({
    queryKey: [meetingKeys.detail(meetingId), 'attendees'],
    queryFn: () => findAttendess(meetingId),
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
