import { NAME_MAX_LENGTH } from '@/constants/validation';
import z from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(NAME_MAX_LENGTH, 'First name is too long'),
  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .max(NAME_MAX_LENGTH, 'Last name is too long'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
