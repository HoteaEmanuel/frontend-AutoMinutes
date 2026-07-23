import { useQuery } from '@tanstack/react-query';
import { findTranscript } from '../api';
import { meetingKeys } from './useMeetings';

export const useGetTranscript = (meetingId: string) =>
  useQuery({
    queryKey: [meetingKeys.detail(meetingId), 'transcript'],
    queryFn: () => findTranscript(meetingId),
  });
