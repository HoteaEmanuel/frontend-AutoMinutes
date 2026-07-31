import { CalendarClock, CalendarPlus } from 'lucide-react';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import ActionRequiredCard from '@organisms/dashboard/ActionRequiredCard/ActionRequiredCard';
import MeetingsTimelineCard from '@organisms/dashboard/MeetingsTimelineCard/MeetingsTimelineCard';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import DashboardSkeleton from './DashboardSkeleton';

const getGreeting = (hour: number) => {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardTemplate = () => {
  const user = useAuthStore((s) => s.user);
  const { urgentItems, upcoming, recent, isPending, isError, error, refetch } = useDashboard();

  if (isError)
    return (
      <ErrorRefetch errorMessage={error?.message ?? 'Something went wrong'} refetch={refetch} />
    );

  if (isPending) return <DashboardSkeleton />;

  return (
    <div className="flex w-full flex-col gap-6 p-2">
      <h1 className="text-2xl font-bold">
        {getGreeting(new Date().getHours())}
        {user?.firstName ? `, ${user.firstName}` : ''}
      </h1>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActionRequiredCard items={urgentItems} />
        </div>

        <div className="flex flex-col gap-4">
          <MeetingsTimelineCard
            title="Upcoming meetings"
            meetings={upcoming}
            emptyIcon={CalendarPlus}
            emptyTitle="No upcoming meetings"
            emptyDescription="Schedule a meeting to see it here."
            accent="brand"
          />
          <MeetingsTimelineCard
            title="Recently held"
            meetings={recent}
            emptyIcon={CalendarClock}
            emptyTitle="No past meetings yet"
            emptyDescription="Meetings you've held will show up here."
            accent="muted"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
