import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  findTranscript,
  findTranscriptVersions,
  selectTranscriptVersion,
  uploadTranscript,
} from '../api';
import { meetingKeys } from './useMeetings';
import { aiResultsKeys } from '@/features/ai-results/hooks/useAIResults';

export const transcriptKeys = {
  detail: (meetingId: string) => ['transcript', meetingId] as const,
  versions: (meetingId: string) => ['transcript', meetingId, 'versions'] as const,
};

export const useGetTranscript = (meetingId: string) =>
  useQuery({
    queryKey: transcriptKeys.detail(meetingId),
    queryFn: () => findTranscript(meetingId),
    enabled: Boolean(meetingId),
  });

export const useTranscriptVersions = (meetingId: string, enabled = true) =>
  useQuery({
    queryKey: transcriptKeys.versions(meetingId),
    queryFn: () => findTranscriptVersions(meetingId),
    enabled: Boolean(meetingId) && enabled,
  });

export const useUploadTranscript = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => uploadTranscript({ meetingId, content }),
    onSuccess: () => {
      toast.success('Transcript uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: transcriptKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: transcriptKeys.versions(meetingId) });
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useSelectTranscriptVersion = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transcriptId: string) => selectTranscriptVersion(transcriptId),
    onSuccess: () => {
      toast.success('Active transcript version updated!');
      queryClient.invalidateQueries({ queryKey: transcriptKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: transcriptKeys.versions(meetingId) });
      queryClient.invalidateQueries({ queryKey: aiResultsKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
    onError: (error) => toast.error(error.message),
  });
};
