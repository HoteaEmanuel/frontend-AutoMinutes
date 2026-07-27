import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset - you can now log in');
      navigate('/auth/login');
    },
  });
};
