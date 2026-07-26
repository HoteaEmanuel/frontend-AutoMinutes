import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';

const useLogin = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((auth) => auth.setSession);

  return useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: ({ data }) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      toast.success('Logged in successfully');
      navigate('/meetings');
    },
  });
};

export default useLogin;
