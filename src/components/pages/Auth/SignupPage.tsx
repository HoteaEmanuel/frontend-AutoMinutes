import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from './signupSchema';
import { Button } from '@/components/ui/button';
import FormField from '@/components/molecules/FormField/FormField';
import Divider from '@molecules/Divider/Divider';
import GoogleButton from '@molecules/GoogleButton/GoogleButton';
import { Link, useNavigate } from 'react-router';
import z from 'zod';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/errors';

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync: signUp, isPending, error } = useSignUp();
  const user = useAuthStore((auth) => auth.user);
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    await signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    console.log('USER: ', user);
    reset();
    navigate('/meetings');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <Card className="shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-md flex-col gap-4 rounded-lg p-6 "
        >
          <div>
            <h2 className="text-gradient text-4xl text-center font-bold">Sign up</h2>
          </div>
          {error && <p className="text-red-500 font-semibold">{getErrorMessage(error)}</p>}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First name"
              id="firstName"
              register={register}
              placeholder="First Name"
              error={errors.firstName?.message}
              hasError={!!errors.firstName?.message || !!error}
            />
            <FormField
              label="Last Name"
              id="lastName"
              register={register}
              placeholder="Last Name"
              error={errors.lastName?.message}
              hasError={!!errors.lastName?.message || !!error}
            />
          </div>

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.email?.message}
            hasError={!!errors.email?.message || !!error}
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            register={register}
            placeholder="Password"
            error={errors.password?.message}
            hasError={!!errors.password?.message || !!error}
          />
          <FormField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            register={register}
            error={errors.confirmPassword?.message}
            hasError={!!errors.confirmPassword?.message || !!error}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Sign up'}
          </Button>

          <Divider text={'Or'} />
          <GoogleButton />
          <div className="flex gap-1 w-full justify-center items-center">
            <span className="text-xxs font-semibold">Already have an account? </span>
            <Button variant={'link'} className="text-xs">
              <Link to={'/auth/login'}>Login</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;
