import { signupSchema } from './../../../components/pages/Auth/signupSchema';
import { api } from '@/lib/axios';
import z from 'zod';
type LoginDto = Omit<z.infer<typeof signupSchema>, 'confirmPassword'>;
export const signup = async (loginDto: LoginDto) =>
  api.post(`/auth/signup`, loginDto).then((data) => data);
