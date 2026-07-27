import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormField from '@/components/molecules/FormField/FormField';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema } from './resetPasswordSchema';
import { Link, Navigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { getErrorMessage } from '@/lib/errors';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: submitResetPassword, isPending, error } = useResetPassword();

  if (!token) return <Navigate to="/auth/forgot-password" replace />;

  const onSubmit = (data: ResetPasswordFormData) => {
    submitResetPassword({ token, newPassword: data.password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="min-w-sm max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 p-6">
          <h2 className="text-3xl text-center text-gradient font-bold">Reset password</h2>
          {error && <p className="text-red-500 font-semibold">{getErrorMessage(error)}</p>}

          <FormField
            label="New Password"
            id="password"
            type="password"
            register={register}
            placeholder="New Password"
            error={errors.password?.message}
            hasError={!!errors.password?.message || !!error}
          />
          <FormField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            register={register}
            placeholder="Confirm Password"
            error={errors.confirmPassword?.message}
            hasError={!!errors.confirmPassword?.message || !!error}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Resetting...' : 'Reset password'}
          </Button>

          <div className="flex gap-1 w-full justify-center items-center">
            <Button variant="link" className="text-xs">
              <Link to="/auth/forgot-password">Request a new link</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
