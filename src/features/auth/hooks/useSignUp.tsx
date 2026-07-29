import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export const useSignUp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signup,
    onSuccess: ({ data }) => {
      toast.success("If this email isn't already registered, we've sent it a verification code.");
      navigate(`/auth/verify-email?email=${encodeURIComponent(data.email)}&sent=1`, {
        replace: true,
      });
    },
  });
};
