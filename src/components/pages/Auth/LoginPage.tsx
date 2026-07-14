import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormField from '@/components/molecules/FormField/FormField';
import { Button } from '@/components/ui/button';
import { loginSchema } from './loginSchema';

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6"
      >
        <h2 className="text-3xl text-center">Log In</h2>

        <FormField
          label="Email"
          id="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />
        <FormField
          label="Password"
          id="password"
          type="password"
          register={register}
          error={errors.password?.message}
        />
        <Button type="submit">Log In</Button>
      </form>
    </div>
  );
};

export default LoginPage;
