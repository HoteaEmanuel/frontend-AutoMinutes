import { useParams } from 'react-router';
import MeetingDetailTemplate from '@templates/MeetingDetailTemplate/MeetingDetailTemplate';
import MeetingNotFound from '@pages/NotFound/MeetingNotFound/MeetingNotFound';
import { usePageTitle } from '@/hooks/usePageTitle';

const MeetingDetailPage = () => {
  usePageTitle('Meeting details');
  const { meetingId } = useParams<{ meetingId: string }>();

  if (!meetingId) return <MeetingNotFound />;

  return <MeetingDetailTemplate meetingId={meetingId} />;
};

export default MeetingDetailPage;
