import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';
import axios from 'axios';

const useLogin = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((auth) => auth.setSession);

  return useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: ({ data }) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      toast.success('Logged in successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      if (!axios.isAxiosError(error)) return;
      const data = error.response?.data as { code?: string; email?: string } | undefined;
      if (data?.code !== 'EMAIL_NOT_VERIFIED') return;
      navigate(`/auth/verify-email?email=${encodeURIComponent(data.email ?? '')}`);
    },
  });
};

export default useLogin;
