import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProfile } from '../api';
import { userKeys } from './useMe';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setUser({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me });
      toast.success('Profile updated successfully!');
    },
  });
};
