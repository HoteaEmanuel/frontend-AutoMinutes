import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useTheme } from '@/features/theme/useTheme';

import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router';
import AppNavActions from '@molecules/AppNavActions/AppNavActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserInitials } from '@/features/user/utils/user';

const AppNavbar = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/home" className="text-xl font-bold text-foreground">
          AutoMinutes
        </Link>

        <AppNavActions />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'dark' ? <Moon className="text-primary" /> : <Sun />}
          </Button>
          {user && user.avatar && (
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AppNavbar;
