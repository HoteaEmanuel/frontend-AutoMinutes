import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarDays, CheckCircle2, ListChecks } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import FormField from '@/components/molecules/FormField/FormField';
import { AvatarUploader } from '@/components/organisms/AvatarUploader/AvatarUploader';
import { ChangePasswordCard } from '@/components/organisms/ChangePasswordCard/ChangePasswordCard';
import { DangerZoneCard } from '@/components/organisms/DangerZoneCard/DangerZoneCard';
import { useMe } from '@/features/user/hooks/useMe';
import { useProfileStats } from '@/features/user/hooks/useProfileStats';
import { useUpdateProfile } from '@/features/user/hooks/useUpdateProfile';
import { profileSchema, type ProfileFormValues } from './profileSchema';
import ProfileSkeleton from './ProfileSkeleton';

const StatCard = ({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  loading: boolean;
}) => (
  <Card>
    <CardContent className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none">
          {loading ? <Skeleton className="h-6 w-8" /> : value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

const ProfileTemplate = () => {
  const { data: me, isLoading } = useMe();
  const { data: stats, isLoading: statsLoading } = useProfileStats();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: me?.firstName ?? '',
      lastName: me?.lastName ?? '',
    },
  });

  if (isLoading || !me) {
    return <ProfileSkeleton />;
  }

  const initials = `${me.firstName?.[0] ?? ''}${me.lastName?.[0] ?? ''}`.toUpperCase();
  const isGoogle = me.provider === 'GOOGLE';

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <AvatarUploader src={me.avatar} fallback={initials} />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="text-xl font-semibold">
                {me.firstName} {me.lastName}
              </span>
              <Badge variant={isGoogle ? 'secondary' : 'outline'}>
                {isGoogle ? 'Google' : 'Local'}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{me.email}</span>
            <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
              <CalendarDays className="size-3.5" />
              Member since {format(new Date(me.createdAt), 'MMMM yyyy')}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={CalendarDays}
          label="Meetings"
          value={stats?.meetings ?? 0}
          loading={statsLoading}
        />
        <StatCard
          icon={ListChecks}
          label="Action items"
          value={stats?.actionItems ?? 0}
          loading={statsLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.completed ?? 0}
          loading={statsLoading}
        />
      </div>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h2 className="text-base font-medium">Personal information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="First name"
                id="firstName"
                register={register}
                error={errors.firstName?.message}
                hasError={!!errors.firstName}
              />
              <FormField
                label="Last name"
                id="lastName"
                register={register}
                error={errors.lastName?.message}
                hasError={!!errors.lastName}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChangePasswordCard isGoogle={isGoogle} />
        <DangerZoneCard />
      </div>
    </div>
  );
};

export default ProfileTemplate;
