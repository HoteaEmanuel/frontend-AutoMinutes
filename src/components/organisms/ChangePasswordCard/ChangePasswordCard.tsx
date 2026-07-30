import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormField from '@/components/molecules/FormField/FormField';
import { useChangePassword } from '@/features/user/hooks/useChangePassword';
import { useSetPassword } from '@/features/user/hooks/useSetPassword';
import { getErrorMessage } from '@/lib/errors';
import { toast } from 'sonner';
import {
  changePasswordSchema,
  setPasswordSchema,
  type ChangePasswordFormValues,
  type SetPasswordFormValues,
} from '@templates/ProfileTemplate/changePasswordSchema';

const ChangePasswordForm = () => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
    } catch (error) {
      const message = getErrorMessage(error);
      setError('currentPassword', { type: 'server', message });
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <FormField
          label="Current password"
          id="currentPassword"
          type="password"
          register={register}
          error={errors.currentPassword?.message}
          hasError={!!errors.currentPassword}
        />
        <FormField
          label="New password"
          id="newPassword"
          type="password"
          register={register}
          error={errors.newPassword?.message}
          hasError={!!errors.newPassword}
        />
        <FormField
          label="Confirm new password"
          id="confirmNewPassword"
          type="password"
          register={register}
          error={errors.confirmNewPassword?.message}
          hasError={!!errors.confirmNewPassword}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Change password'}
        </Button>
      </div>
    </form>
  );
};

const SetPasswordForm = () => {
  const { mutateAsync: setPassword, isPending } = useSetPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: SetPasswordFormValues) => {
    try {
      await setPassword({ newPassword: data.newPassword });
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        You signed up with Google. Set a password to also be able to log in with your email.
      </p>
      <div className="flex flex-col gap-4">
        <FormField
          label="New password"
          id="newPassword"
          type="password"
          register={register}
          error={errors.newPassword?.message}
          hasError={!!errors.newPassword}
        />
        <FormField
          label="Confirm new password"
          id="confirmNewPassword"
          type="password"
          register={register}
          error={errors.confirmNewPassword?.message}
          hasError={!!errors.confirmNewPassword}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Set password'}
        </Button>
      </div>
    </form>
  );
};

type ChangePasswordCardProps = {
  hasPassword: boolean;
};

export const ChangePasswordCard = ({ hasPassword }: ChangePasswordCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-base font-medium">Security</h2>
        {hasPassword ? <ChangePasswordForm /> : <SetPasswordForm />}
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
