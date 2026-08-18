import ProfileTemplate from '@templates/ProfileTemplate/ProfileTemplate';
import { usePageTitle } from '@/hooks/usePageTitle';

const ProfilePage = () => {
  usePageTitle('Profile');

  return <ProfileTemplate/>;
};

export default ProfilePage;
