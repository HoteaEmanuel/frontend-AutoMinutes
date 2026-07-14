import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { logout } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

const useLogout = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logout,
    mutationKey: ['logout'],

    onSettled: () => {
      clearSession();
      navigate('/auth/login');
    },
  });
};

export default useLogout;
