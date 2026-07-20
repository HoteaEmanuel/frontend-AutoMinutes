import {
  InvalidateOptions,
  InvalidateQueryFilters,
  keepPreviousData,
  QueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { createMeeting, fetchAllMeetings, fetchMeeting, fetchUserMeetings } from '../api';
import { CreateMeetingDto, PaginatedMeetingsDto } from '@/gql/types';
import { toast } from 'sonner';

export const meetingKeys = {
  all: ['meetings'] as const,
  detail: (id: string) => ['meetings', id] as const,
};

export const meetingsQueryOptions = (input: PaginatedMeetingsDto) => ({
  queryKey: [meetingKeys.all, { ...input }],
  queryFn: () => fetchUserMeetings({ ...input }),
});

export const useMeetings = (input: PaginatedMeetingsDto) =>
  useQuery({
    ...meetingsQueryOptions(input),
    placeholderData: keepPreviousData,
  });

export const useGetAllMeetings = () =>
  useQuery({
    queryKey: meetingKeys.all,
    queryFn: fetchAllMeetings,
  });

export const useGetMeeting = (id: string) =>
  useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => fetchMeeting(id),
  });

export const useAddMeeting = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationKey: meetingKeys.all,
    mutationFn: (input: CreateMeetingDto) => createMeeting(input),
    onSuccess: () => {
      toast.success('Meeting created successfully!');
    },
    onSettled: () => queryClient.invalidateQueries([meetingKeys.all] as InvalidateQueryFilters),
  });
};
