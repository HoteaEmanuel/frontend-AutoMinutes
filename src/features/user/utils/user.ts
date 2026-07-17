import { User } from '../types/user';

export const getUserInitials = (user: User) => {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '';

  return initials;
};
