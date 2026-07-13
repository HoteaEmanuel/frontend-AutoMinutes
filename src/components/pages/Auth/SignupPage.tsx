import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from './signupSchema';
import { Button } from '@/components/ui/button';
import FormField from '@/components/molecules/FormField/FormField';
import Divider from '@molecules/Divider/Divider';
import GoogleButton from '@molecules/GoogleButton/GoogleButton';
import { Link } from 'react-router';

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-accent p-6 shadow-md"
      >
        <div>
          <h2 className="text-gradient text-4xl text-center font-bold">Sign up</h2>
          {/* <p className="text-xs font-semibold italic">Create your account</p> */}
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
        <Button type="submit">Sign Up</Button>

        <Divider text={'Or'} />
        <GoogleButton />
        <div className="flex gap-1 w-full justify-center items-center">
          <span className="text-xxs font-semibold">Already have an account? </span>
          <Button variant={'link'} className="text-xs">
            <Link to={'/login'}>Login</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
