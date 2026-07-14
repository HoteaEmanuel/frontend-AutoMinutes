import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormField from '@/components/molecules/FormField/FormField';
import { Button } from '@/components/ui/button';
import { loginSchema } from './loginSchema';
import Divider from '@molecules/Divider/Divider';
import GoogleButton from '@molecules/GoogleButton/GoogleButton';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import useLogin from '@/features/auth/hooks/useLogin';
import { getErrorMessage } from '@/lib/errors';

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: login, isPending, error } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      reset();
    } catch {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="min-w-sm max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full  flex-col gap-4 p-6">
          <h2 className="text-3xl text-center text-gradient font-bold">Welcome back</h2>
          {error && <p className="text-red-500 font-semibold">{getErrorMessage(error)}</p>}

          <FormField
            label="Email"
            id="email"
            type="email"
            register={register}
            error={errors.email?.message}
            placeholder="Email"
            hasError={!!errors.email?.message || !!error}
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            register={register}
            placeholder="Password"
            error={errors.password?.message}
            hasError={!!errors.email?.message || !!error}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Loggin...' : 'Log In'}
          </Button>

          <Divider text={'Or'} />
          <GoogleButton />
          <div className="flex gap-1 w-full justify-center items-center">
            <span className="text-xxs font-semibold">Don&apos;t have an account?</span>
            <Button variant={'link'} className="text-xs">
              <Link to={'/auth/signup'}>Sign up</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
