import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'Comment body is required and cannot be empty'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
