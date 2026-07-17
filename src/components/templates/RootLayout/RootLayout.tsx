import AuthNavBar from '@organisms/AuthNavbar/AuthNavBar';
import Header from '@templates/Header/Header';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <Header>
        <AuthNavBar />
      </Header>
      <main className="mt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
