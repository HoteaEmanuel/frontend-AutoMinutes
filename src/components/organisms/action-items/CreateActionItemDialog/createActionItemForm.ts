import { z } from 'zod';

export const createActionItemForm = z.object({
  meetingId: z.string().min(1, 'Meeting is required.'),
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  assigneeId: z.string().optional(),
});
