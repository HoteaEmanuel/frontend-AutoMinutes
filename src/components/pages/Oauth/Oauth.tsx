import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import useRefresh from '@/features/auth/hooks/useRefresh';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { GoogleIcon } from '@atoms/icons/GoogleIcon';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Oauth = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate, status } = useRefresh();
  const navigate = useNavigate();

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    // const id = setTimeout(() => navigate(status === 'error' ? '/login' : '/mata'), 4000);
    // return () => clearTimeout(id);
  }, [navigate, status]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <GoogleIcon width={50} height={50} />
          {status === 'success' ? (
            <CheckCircle2 className="h-12 w-12 text-status-completed" />
          ) : status === 'error' ? (
            <XCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}

          <CardTitle className="text-2xl">
            {status === 'success' && 'Signed in with Google'}
            {status === 'error' && 'Sign-in failed'}
            {(status === 'idle' || status === 'pending') && 'Signing you in…'}
          </CardTitle>

          <CardDescription>
            {status === 'success' &&
              `Welcome${user?.firstName ? `, ${user.firstName}` : ''}! Redirecting to your dashboard…`}
            {status === 'error' && 'Google authentication failed. Redirecting to login…'}
            {(status === 'idle' || status === 'pending') && 'Verifying your Google account'}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Oauth;
