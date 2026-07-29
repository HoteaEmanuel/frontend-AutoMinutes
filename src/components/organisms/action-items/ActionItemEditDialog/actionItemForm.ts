import { z } from 'zod';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/validation';

export const actionItemForm = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters.`),
  description: z
    .string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`)
    .optional(),
  deadline: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
  assigneeId: z.string().optional(),
});
