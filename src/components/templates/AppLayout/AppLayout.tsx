import AppNavbar from '@organisms/AppNavbar/AppNavbar';
import { Outlet } from 'react-router';


const AppLayout = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
