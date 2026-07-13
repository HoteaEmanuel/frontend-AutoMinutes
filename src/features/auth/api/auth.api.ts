import { signupSchema } from './../../../components/pages/Auth/signupSchema';
import { api } from '@/lib/axios';
import z from 'zod';

const API_URL = import.meta.env.VITE_REACT_API_URL;
type LoginDto = Omit<z.infer<typeof signupSchema>, 'confirmPassword'>;
export const signup = async (loginDto: LoginDto) =>
  api.post(`/auth/signup`, loginDto).then((data) => data);

export const googleAuth = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const refresh = () => api.post('/auth/refresh');
