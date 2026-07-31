import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((auth) => auth.setSession);

  return useMutation({
    mutationFn: verifyEmail,
    mutationKey: ['verify-email'],
    onSuccess: ({ data }) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      toast.success('Email verified');
      navigate('/dashboard');
    },
  });
};
