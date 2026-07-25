import { useQuery } from '@tanstack/react-query';
import { fetchUserMeetings } from '@/features/meetings/api';
import { fetchUserActionItems } from '@/features/action-items/api';

export type ProfileStats = {
  meetings: number;
  actionItems: number;
  completed: number;
};

const fetchProfileStats = async (): Promise<ProfileStats> => {
  const [meetings, actionItems] = await Promise.all([
    fetchUserMeetings({ pageNo: 1, pageSize: 1 }),
    fetchUserActionItems({}),
  ]);

  return {
    meetings: meetings.totalCount,
    actionItems: actionItems.length,
    completed: actionItems.filter((item) => item.status === 'DONE').length,
  };
};

export const useProfileStats = () =>
  useQuery({
    queryKey: ['profile-stats'],
    queryFn: fetchProfileStats,
  });
