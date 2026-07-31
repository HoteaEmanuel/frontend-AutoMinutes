import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router';

const AuthNavBar = () => {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur">
      <nav className="w-full flex items-center justify-between h-10 mt-2 max-w-full sm:max-w-3/4 mx-auto px-4 sm:p-4 bg-transparent">
        <Link
          className={cn(
            'text-lg sm:text-2xl font-bold',
            isLandingPage ? 'text-white/80 ' : 'text-foreground',
          )}
          to={user ? '/dashboard' : '/'}
        >
          AutoMinutes
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
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
              <Link to={'/dashboard'}>Home</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AuthNavBar;
