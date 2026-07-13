import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from './signupSchema';
import { Button } from '@/components/ui/button';
import FormField from '@/components/molecules/FormField/FormField';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: any) => {console.log(data);};

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6">
        <h2 className="text-3xl text-center">Create an Account</h2>

        <FormField label="First name" id="firstName" register={register} error={errors.firstName?.message} />
        <FormField label="Last name" id="lastName" register={register} error={errors.lastName?.message} />
        <FormField label="Email" id="email" type="email" register={register} error={errors.email?.message} />
        <FormField label="Password" id="password" type="password" register={register} error={errors.password?.message} />
        <FormField label="Confirm Password" id="confirmPassword" type="password" register={register} error={errors.confirmPassword?.message} />
        <Button type="submit">Sign Up</Button>

      </form>
    </div>
  )
}

export default SignupPage