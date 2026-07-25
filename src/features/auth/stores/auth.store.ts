import { create } from 'zustand';
type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
} | null;
type Status = 'pending' | 'authenticated' | 'unauthenticated';
type AuthState = {
  user: User;
  accessToken: string | null;
  status: Status;
  setSession: ({ accessToken, user }: { accessToken: string; user: User }) => void;
  setUser: (user: Partial<NonNullable<User>>) => void;
  clearSession: () => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'pending',

  setSession: ({ accessToken, user }: { accessToken: string; user: User }) =>
    set(() => ({
      accessToken,
      user,
      status: 'authenticated',
    })),

  setUser: (user: Partial<NonNullable<User>>) =>
    set((state) => (state.user ? { user: { ...state.user, ...user } } : {})),
  clearSession: () =>
    set(() => ({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
    })),
}));
