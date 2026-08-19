import MeetingsTemplate from '@templates/MeetingsTemplate/MeetingsTemplate';
import { usePageTitle } from '@/hooks/usePageTitle';

const MeetingsPage = () => {
  usePageTitle('Meetings');
  return (
    <div className="page-container">
      <MeetingsTemplate />
    </div>
  );
};

export default MeetingsPage;
