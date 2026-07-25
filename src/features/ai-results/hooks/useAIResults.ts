import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { findAIMeetingResults, generateAIResults } from '../api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';
import { attendeesKeys } from '@/features/attendees/hooks/useAttendees';
import { actionItemsKeys } from '@/features/action-items/hooks/useActionItems';

export const aiResultsKeys = {
  detail: (meetingId: string) => ['ai-results', meetingId] as const,
};

export const useGetAIResults = (meetingId: string) =>
  useQuery({
    queryKey: aiResultsKeys.detail(meetingId),
    queryFn: () => findAIMeetingResults(meetingId),
    enabled: Boolean(meetingId),
  });

export const useGenerateAIResults = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateAIResults(meetingId),
    onSuccess: () => {
      toast.success('AI results generated successfully!');
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: attendeesKeys.list(meetingId) });
      queryClient.invalidateQueries({ queryKey: actionItemsKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: [meetingKeys.all] });
    },
    onError: (error) => toast.error(error.message),
  });
};
