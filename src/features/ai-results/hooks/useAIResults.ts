import { useQuery } from '@tanstack/react-query';
import { findAIMeetingResults } from '../api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';

export const useGetAIResults = (meetingId: string) =>
  useQuery({
    queryKey: [meetingKeys.detail(meetingId), 'ai-results'],
    queryFn: () => findAIMeetingResults(meetingId),
  });
