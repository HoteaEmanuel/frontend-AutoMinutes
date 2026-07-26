import { z } from 'zod';

export const attendeeForm = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.email('Add a valid email address.').optional().or(z.literal('')),
  role: z.enum(['PARTICIPANT', 'ORGANIZER']),
});

export const attendeeRoleItems = [
  { label: 'Participant', value: 'PARTICIPANT' },
  { label: 'Organizer', value: 'ORGANIZER' },
];
