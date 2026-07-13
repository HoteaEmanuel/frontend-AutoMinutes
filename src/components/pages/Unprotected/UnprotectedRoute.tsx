import { useAuthStore } from '@/features/auth/stores/auth.store';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

const UnprotectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? <Navigate to={'/home'} /> : <Outlet />;
};

export default UnprotectedRoute;
