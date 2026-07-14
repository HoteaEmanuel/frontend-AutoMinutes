import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useTheme } from '@/features/theme/useTheme';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const AuthNavBar = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur">
      <nav className="w-screen flex items-center justify-between h-10 mt-2 max-w-3/4 mx-auto p-4 bg-transparent">
        <Link className="text-2xl font-bold text-gray-500" to={'/'}>
          AutoMinutes
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={'bg-transparent hover:bg-transparent'}
          >
            {theme === 'dark' ? <Moon className="text-primary" /> : <Sun />}
          </Button>
          {!user ? (
            <>
              <Button
                variant={'ghost'}
                className={'hover:bg-transparent hover:border hover:border-primary'}
              >
                <Link to={'/auth/login'}>Login</Link>
              </Button>
              <Button>
                <Link to={'/auth/signup'}>Get started</Link>
              </Button>
            </>
          ) : (
            <Button>
              <Link to={'/home'}>Home</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AuthNavBar;
