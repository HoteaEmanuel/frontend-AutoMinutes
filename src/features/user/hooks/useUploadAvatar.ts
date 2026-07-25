import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadAvatar } from '../api';
import { userKeys } from './useMe';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (user) => {
      if (user.avatar) setUser({ avatar: user.avatar });
      queryClient.invalidateQueries({ queryKey: userKeys.me });
      toast.success('Avatar updated successfully!');
    },
  });
};
