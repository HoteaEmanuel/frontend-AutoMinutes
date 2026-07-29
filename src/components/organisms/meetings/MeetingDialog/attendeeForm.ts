import { z } from 'zod';
import { NAME_MAX_LENGTH } from '@/constants/validation';

export const attendeeForm = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters.`),
  email: z.email('Add a valid email address.').optional().or(z.literal('')),
  role: z.enum(['PARTICIPANT', 'ORGANIZER']),
});

export const attendeeRoleItems = [
  { label: 'Participant', value: 'PARTICIPANT' },
  { label: 'Organizer', value: 'ORGANIZER' },
];
