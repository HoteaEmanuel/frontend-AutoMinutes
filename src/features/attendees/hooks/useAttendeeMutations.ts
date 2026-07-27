import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addAttendee, deleteAttendee, updateAttendee } from '../api';
import { attendeesKeys } from './useAttendees';

export const useAddAttendee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAttendee,
    onSuccess: (attendee) => {
      toast.success('Attendee added successfully!');
      queryClient.invalidateQueries({ queryKey: attendeesKeys.list(attendee.meetingId) });
    },
  });
};

export const useUpdateAttendee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendee,
    onSuccess: (attendee) => {
      toast.success('Attendee updated successfully!');
      queryClient.invalidateQueries({ queryKey: attendeesKeys.list(attendee.meetingId) });
    },
  });
};

export const useDeleteAttendee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendee,
    onSuccess: (attendee) => {
      toast.success('Attendee deleted successfully!');
      queryClient.invalidateQueries({ queryKey: attendeesKeys.list(attendee.meetingId) });
    },
  });
};
