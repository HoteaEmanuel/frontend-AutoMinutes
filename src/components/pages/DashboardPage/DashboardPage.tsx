import DashboardTemplate from '@templates/DashboardTemplate/DashboardTemplate';
import { usePageTitle } from '@/hooks/usePageTitle';

const DashboardPage = () => {
  usePageTitle('Dashboard');
  return (
    <div className="page-container">
      <DashboardTemplate />
    </div>
  );
};

export default DashboardPage;
