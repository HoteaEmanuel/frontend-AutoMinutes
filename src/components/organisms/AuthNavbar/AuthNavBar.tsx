import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Link } from 'react-router';

const AuthNavBar = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur">
      <nav className="w-screen flex items-center justify-between h-10 mt-2 max-w-3/4 mx-auto p-4 bg-transparent">
        <Link className="text-2xl font-bold text-gray-500" to={'/'}>
          AutoMinutes
        </Link>
        <div className="flex items-center gap-2">
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
