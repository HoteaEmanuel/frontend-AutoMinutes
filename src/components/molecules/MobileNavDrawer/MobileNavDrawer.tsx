import { useState } from 'react';
import { LogOut, Menu, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { logout } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useTheme } from '@/features/theme/useTheme';
import { getUserInitials } from '@/features/user/utils/user';
import { navLinks } from '@molecules/AppNavActions/AppNavActions';

const MobileNavDrawer = () => {
  const [open, setOpen] = useState(false);
  const { user, clearSession } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      clearSession();
      setOpen(false);
      navigate('/auth/login');
    }
  };

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu />
            </Button>
          }
        />
        <SheetContent side="left" className="flex w-72 flex-col">
          <SheetHeader className="pb-6">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            {user && (
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 rounded-md -m-2 p-3 transition-colors hover:bg-muted"
              >
                <Avatar className="size-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xl">{getUserInitials(user)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-lg font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">{user.email}</span>
                </div>
              </Link>
            )}
          </SheetHeader>

          <Separator />

          <ul className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  <link.icon className="size-4" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex flex-col gap-2 px-4">
            <Label className="flex items-center gap-2">
              <Palette className="size-4" />
              Appearance
            </Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Appearance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <Sun className="size-4" />
                  Light
                </SelectItem>
                <SelectItem value="dark">
                  <Moon className="size-4" />
                  Dark
                </SelectItem>
                <SelectItem value="system">
                  <Monitor className="size-4" />
                  System
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut />
              Sign out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavDrawer;
