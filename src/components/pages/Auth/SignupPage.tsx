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

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync: signUp, isPending } = useSignUp();
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
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-md flex-col gap-4 rounded-lg p-6 "
        >
          <div>
            <h2 className="text-gradient text-4xl text-center font-bold">Sign up</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First name"
              id="firstName"
              register={register}
              placeholder="First Name"
              error={errors.firstName?.message}
            />
            <FormField
              label="Last Name"
              id="lastName"
              register={register}
              placeholder="Last Name"
              error={errors.lastName?.message}
            />
          </div>

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.email?.message}
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            register={register}
            placeholder="Password"
            error={errors.password?.message}
          />
          <FormField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            register={register}
            error={errors.confirmPassword?.message}
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
