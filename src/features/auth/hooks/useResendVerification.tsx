import { useMutation } from '@tanstack/react-query';
import { resendVerification } from '../api/auth.api';
import { toast } from 'sonner';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerification,
    mutationKey: ['resend-verification'],
    onSuccess: () => {
      toast.success('We sent you a new code');
    },
  });
};
