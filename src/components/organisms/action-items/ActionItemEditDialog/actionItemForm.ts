import { z } from 'zod';

export const actionItemForm = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
  assigneeId: z.string().optional(),
});
