import { useMutation } from '@tanstack/react-query';
import { refresh } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

const useRefresh = () => {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: refresh,
    mutationKey: ['refresh'],
    onSuccess: ({ data }) => {
      setSession({ accessToken: data.accessToken, user: data.user });
    },
  });
};

export default useRefresh;
