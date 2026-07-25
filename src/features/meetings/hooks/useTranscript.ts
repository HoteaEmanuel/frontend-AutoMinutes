import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { findTranscript, uploadTranscript } from '../api';
import { meetingKeys } from './useMeetings';
import { aiResultsKeys } from '@/features/ai-results/hooks/useAIResults';

export const transcriptKeys = {
  detail: (meetingId: string) => ['transcript', meetingId] as const,
};

export const useGetTranscript = (meetingId: string) =>
  useQuery({
    queryKey: transcriptKeys.detail(meetingId),
    queryFn: () => findTranscript(meetingId),
    enabled: Boolean(meetingId),
  });

export const useUploadTranscript = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => uploadTranscript({ meetingId, content }),
    onSuccess: () => {
      toast.success('Transcript uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: transcriptKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
    onError: (error) => toast.error(error.message),
  });
};
