import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  return accessToken ? <Outlet /> : <Navigate to={'/auth/login'} />;
};

export default ProtectedRoute;
