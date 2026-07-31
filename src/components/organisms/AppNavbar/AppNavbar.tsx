import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useTheme } from '@/features/theme/useTheme';
import { Moon, Plus, Sun } from 'lucide-react';
import { Link } from 'react-router';
import AppNavActions from '@molecules/AppNavActions/AppNavActions';
import MobileNavDrawer from '@molecules/MobileNavDrawer/MobileNavDrawer';
import NewMeetingModal from '@organisms/meetings/NewMeetingModal/NewMeetingModal';
import { ProfileMenu } from '@organisms/ProfileMenu/ProfileMenu';

const AppNavbar = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MobileNavDrawer />
            <Link to="/dashboard" className="text-xl font-bold text-foreground">
              AutoMinutes
            </Link>
          </div>

          <AppNavActions />
          <div className="flex items-center gap-2">
            {user && (
              <Button onClick={() => setIsNewMeetingOpen(true)}>
                <Plus />
                New meeting
              </Button>
            )}

            <div className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'dark' ? <Moon className="text-primary" /> : <Sun />}
              </Button>
            </div>

            <div className="hidden sm:block">
              <ProfileMenu />
            </div>
          </div>
        </nav>
      </header>

      <NewMeetingModal isOpen={isNewMeetingOpen} onClose={() => setIsNewMeetingOpen(false)} />
    </>
  );
};

export default AppNavbar;
