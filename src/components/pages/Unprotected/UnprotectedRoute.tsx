import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Navigate, Outlet } from 'react-router';

const UnprotectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? <Navigate to={'/meetings'} /> : <Outlet />;
};

export default UnprotectedRoute;
