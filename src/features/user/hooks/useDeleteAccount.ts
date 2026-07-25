import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { deleteAccount } from '../api';
import { logout } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: async () => {
      await deleteAccount();
      await logout();
    },
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      toast.success('Your account has been deleted.');
      navigate('/auth/login');
    },
  });
};
