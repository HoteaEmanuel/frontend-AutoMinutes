import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { findAIMeetingResults, findAIResultsHistory, generateAIResults } from '../api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';
import { attendeesKeys } from '@/features/attendees/hooks/useAttendees';
import { actionItemsKeys } from '@/features/action-items/hooks/useActionItems';
import { Meeting, PaginatedMeetings } from '@/gql/types';

const setMeetingStatusInCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  meetingId: string,
  status: Meeting['status'],
) => {
  queryClient.setQueryData(meetingKeys.detail(meetingId), (meeting?: Meeting) =>
    meeting ? { ...meeting, status } : meeting,
  );
  queryClient.setQueriesData<PaginatedMeetings>({ queryKey: meetingKeys.all }, (page) =>
    page && Array.isArray(page.meetings)
      ? {
          ...page,
          meetings: page.meetings.map((meeting) =>
            meeting.id === meetingId ? { ...meeting, status } : meeting,
          ),
        }
      : page,
  );
};

export const aiResultsKeys = {
  detail: (meetingId: string) => ['ai-results', meetingId] as const,
  history: (meetingId: string) => ['ai-results', meetingId, 'history'] as const,
};

export const useGetAIResults = (meetingId: string) =>
  useQuery({
    queryKey: aiResultsKeys.detail(meetingId),
    queryFn: () => findAIMeetingResults(meetingId),
    enabled: Boolean(meetingId),
  });

export const useAIResultsHistory = (meetingId: string, enabled = true) =>
  useQuery({
    queryKey: aiResultsKeys.history(meetingId),
    queryFn: () => findAIResultsHistory(meetingId),
    enabled: Boolean(meetingId) && enabled,
  });

export const useGenerateAIResults = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateAIResults(meetingId),
    onMutate: () => {
      setMeetingStatusInCache(queryClient, meetingId, 'PROCESSING');
    },
    onSuccess: () => {
      toast.success('AI results generated successfully!');
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.history(meetingId) });
      queryClient.invalidateQueries({ queryKey: attendeesKeys.list(meetingId) });
      queryClient.invalidateQueries({ queryKey: actionItemsKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
    onError: (error) => {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
};
