import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { setPassword } from '../api';

export const useSetPassword = () => {
  return useMutation({
    mutationFn: setPassword,
    onSuccess: () => {
      toast.success('Password set successfully!');
    },
  });
};
