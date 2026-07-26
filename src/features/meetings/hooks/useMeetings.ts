import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewMeeting, fetchAllMeetings, fetchMeeting, fetchUserMeetings } from '../api';
import { PaginatedMeetingsDto } from '@/gql/types';

export const meetingKeys = {
  all: ['meetings'] as const,
  detail: (id: string) => ['meetings', id] as const,
};

export const meetingsQueryOptions = (input: PaginatedMeetingsDto) => ({
  queryKey: [...meetingKeys.all, { ...input }],
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

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
};
