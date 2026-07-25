import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword } from '../api';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
  });
};
