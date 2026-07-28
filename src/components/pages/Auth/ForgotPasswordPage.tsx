import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormField from '@/components/molecules/FormField/FormField';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema } from './forgotPasswordSchema';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { getErrorMessage } from '@/lib/errors';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: submitForgotPassword, isPending, isSuccess, data, error } = useForgotPassword();

  const onSubmit = (formData: ForgotPasswordFormData) => {
    submitForgotPassword(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="min-w-sm max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 p-6">
          <h2 className="text-3xl text-center text-gradient font-bold">Forgot password</h2>

          {isSuccess ? (
            <p className="text-sm text-center text-muted-foreground">{data.data.message}</p>
          ) : (
            <>
              <p className="text-sm text-center text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              {error && <p className="text-red-500 font-semibold">{getErrorMessage(error)}</p>}

              <FormField
                label="Email"
                id="email"
                type="email"
                register={register}
                placeholder="Email"
                error={errors.email?.message}
                hasError={!!errors.email?.message || !!error}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send reset link'}
              </Button>
            </>
          )}

          <div className="flex gap-1 w-full justify-center items-center">
            <Button variant="link" className="text-xs">
              <Link to="/auth/login">Back to login</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
