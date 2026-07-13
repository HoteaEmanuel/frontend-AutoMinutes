import { create } from 'zustand';
type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
} | null;
// type Status = 'pending' | 'successfull' | 'error';
type AuthState = {
  user: User;
  accessToken: string | null;
  setSession: ({ accessToken, user }: { accessToken: string; user: User }) => void;
  clearSession: () => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setSession: ({ accessToken, user }: { accessToken: string; user: User }) =>
    set(() => ({
      accessToken,
      user,
    })),
  clearSession: () =>
    set(() => ({
      user: null,
      accessToken: null,
    })),
}));
