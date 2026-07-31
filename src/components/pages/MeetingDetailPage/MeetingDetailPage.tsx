import { useParams } from 'react-router';
import MeetingDetailTemplate from '@templates/MeetingDetailTemplate/MeetingDetailTemplate';
import MeetingNotFound from '@pages/NotFound/MeetingNotFound/MeetingNotFound';

const MeetingDetailPage = () => {
  const { meetingId } = useParams<{ meetingId: string }>();

  if (!meetingId) return <MeetingNotFound />;

  return <MeetingDetailTemplate meetingId={meetingId} />;
};

export default MeetingDetailPage;
