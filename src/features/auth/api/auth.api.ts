import { signupSchema } from './../../../components/pages/Auth/signupSchema';
import { api } from '@/lib/axios';
import { loginSchema } from '@pages/Auth/loginSchema';
import z from 'zod';

const API_URL = import.meta.env.VITE_REACT_API_URL;
type SignupDTO = Omit<z.infer<typeof signupSchema>, 'confirmPassword'>;
type LoginDto = z.infer<typeof loginSchema>;
export const signup = async (signupDto: SignupDTO) =>
  api.post(`/auth/signup`, signupDto).then((data) => data);

export const login = async (loginDto: LoginDto) =>
  api.post('/auth/login', loginDto).then((data) => data);

export const googleAuth = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const refresh = () => api.post('/auth/refresh');

export const logout = () => api.post('/auth/logout');

export const verifyEmail = async (dto: { email: string; code: string }) =>
  api.post('/auth/verify-email', dto).then((data) => data);

export const resendVerification = async (dto: { email: string }) =>
  api.post('/auth/resend-verification', dto).then((data) => data);

export const forgotPassword = async (dto: { email: string }) =>
  api.post('/auth/forgot-password', dto).then((data) => data);

export const resetPassword = async (dto: { token: string; newPassword: string }) =>
  api.post('/auth/reset-password', dto).then((data) => data);
