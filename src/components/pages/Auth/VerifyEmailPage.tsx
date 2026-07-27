import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail';
import { useResendVerification } from '@/features/auth/hooks/useResendVerification';
import { getErrorMessage } from '@/lib/errors';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const sent = searchParams.get('sent') === '1';

  const [code, setCode] = useState('');
  // Seeded from ?sent=1 (present only right after signup, where a code was
  // just sent) and 0 otherwise - a user arriving from login needs Resend
  // immediately, not a 60s wait for a code they never received.
  const [cooldown, setCooldown] = useState(() => (sent ? 60 : 0));

  const { mutate: verify, isPending: isVerifying, error: verifyError } = useVerifyEmail();
  const {
    mutate: resend,
    isPending: isResending,
    error: resendError,
  } = useResendVerification();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown > 0]);

  useEffect(() => {
    if (resendError && axios.isAxiosError(resendError)) {
      const data = resendError.response?.data as { retryAfterSeconds?: number } | undefined;
      if (data?.retryAfterSeconds) setCooldown(data.retryAfterSeconds);
    }
  }, [resendError]);

  if (!email) return <Navigate to="/auth/login" replace />;

  const error = verifyError ?? resendError;

  const handleVerify = (value: string) => {
    verify(
      { email, code: value },
      {
        onError: () => setCode(''),
      },
    );
  };

  const handleResend = () => {
    resend({ email });
    setCooldown(60);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="min-w-sm max-w-md">
        <div className="flex w-full flex-col items-center gap-4 p-6">
          <h2 className="text-3xl text-center text-gradient font-bold">Verify your email</h2>
          <p className="text-sm text-center text-muted-foreground">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
          {error && <p className="text-red-500 font-semibold">{getErrorMessage(error)}</p>}

          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={setCode}
            onComplete={handleVerify}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid={!!error} />
              <InputOTPSlot index={1} aria-invalid={!!error} />
              <InputOTPSlot index={2} aria-invalid={!!error} />
              <InputOTPSlot index={3} aria-invalid={!!error} />
              <InputOTPSlot index={4} aria-invalid={!!error} />
              <InputOTPSlot index={5} aria-invalid={!!error} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            className="w-full"
            disabled={isVerifying || code.length < 6}
            onClick={() => handleVerify(code)}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="flex gap-1 w-full justify-center items-center">
            <span className="text-xxs font-semibold">Didn&apos;t get the code?</span>
            <Button
              variant="link"
              className="text-xs"
              disabled={cooldown > 0 || isResending}
              onClick={handleResend}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </Button>
          </div>

          <Link to="/auth/login" className="text-xxs text-center underline">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
