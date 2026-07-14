import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';
import useRefresh from './useRefresh';

const useInitAuth = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const started = useRef(false);
  const { mutateAsync: refresh } = useRefresh();
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    async function refreshSession() {
      try {
        await refresh();
      } catch (error) {
        clearSession();
      }
    }
    refreshSession();
  }, [setSession, clearSession]);
};

export default useInitAuth;
