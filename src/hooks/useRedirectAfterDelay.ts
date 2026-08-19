import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useRedirect = (delay: number) => {
  const navigate = useNavigate();
  return useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard'), delay);
    return () => clearTimeout(timer);
  }, []);
};
