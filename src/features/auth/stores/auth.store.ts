import { create } from 'zustand';
type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
} | null;
// 'pending' cat timp incercam sa refacem sesiunea din cookie la boot
type Status = 'pending' | 'authenticated' | 'unauthenticated';
type AuthState = {
  user: User;
  accessToken: string | null;
  status: Status;
  setSession: ({ accessToken, user }: { accessToken: string; user: User }) => void;
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
  clearSession: () =>
    set(() => ({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
    })),
}));
