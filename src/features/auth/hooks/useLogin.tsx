import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { toast } from 'sonner';

const useLogin = () => {
  return useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: () => toast.success('Logged in successfully'),
  });
};

export default useLogin;
