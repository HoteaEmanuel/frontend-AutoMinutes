import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
export const useSignUp = () => {
  const setSession = useAuthStore((auth) => auth.setSession);
  return useMutation({
    mutationFn: signup,
    onSuccess: ({ data }) => {
      setSession({ accessToken: data.accessToken, user: data.user });
    },
  });
};
