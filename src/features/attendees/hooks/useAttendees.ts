import { useQuery } from '@tanstack/react-query';
import { findAttendess } from '../api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';

export const useGetAttendees = (meetingId: string) =>
  useQuery({
    queryKey: [meetingKeys.detail(meetingId), 'attendees'],
    queryFn: () => findAttendess(meetingId),
  });
