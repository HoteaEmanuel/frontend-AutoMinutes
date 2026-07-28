import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMeeting,
  deleteMeeting,
  fetchMeeting,
  fetchUserMeetingOptions,
  fetchUserMeetings,
} from '../api';
import { addAttendee } from '@/features/attendees/api';
import { CreateMeetingDto, PaginatedMeetingsDto } from '@/gql/types';
import { toast } from 'sonner';

type NewMeetingAttendee = {
  firstName: string;
  lastName: string;
  email: string;
};

type CreateNewMeetingInput = {
  meeting: CreateMeetingDto;
  attendees: NewMeetingAttendee[];
};

export const meetingKeys = {
  all: ['meetings'] as const,
  detail: (id: string) => ['meetings', id] as const,
  options: ['meetings', 'options'] as const,
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

export const useUserMeetingOptions = () =>
  useQuery({
    queryKey: meetingKeys.options,
    queryFn: fetchUserMeetingOptions,
  });

export const useGetMeeting = (id: string) =>
  useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => fetchMeeting(id),
  });

export const useAddMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: meetingKeys.all,
    mutationFn: (input: CreateMeetingDto) => createMeeting(input),
    onSuccess: () => {
      toast.success('Meeting created successfully!');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: meetingKeys.all }),
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meeting, attendees }: CreateNewMeetingInput) => {
      const newMeeting = await createMeeting(meeting);

      await Promise.all(
        attendees.map((attendee) =>
          addAttendee({
            meetingId: newMeeting.id,
            name: `${attendee.firstName} ${attendee.lastName}`.trim(),
            email: attendee.email,
            role: 'PARTICIPANT',
            aiGenerated: false,
          }),
        ),
      );

      return newMeeting;
    },
    onSuccess: () => {
      toast.success('Meeting created successfully!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.options });
    },
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMeeting(id),
    onSuccess: () => {
      toast.success('Meeting deleted successfully!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
