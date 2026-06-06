import { z } from 'zod';
import { IssueStatus } from '../../generated/prisma/client.js';

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, 'Issue title is required'),
  description: z.string().trim().optional().nullable(),
  priority: z.string().trim().optional().nullable(),
  assigneeUserId: z.string().trim().optional().nullable(),
});

export const updateIssueSchema = z.object({
  title: z.string().trim().min(1, 'Issue title cannot be empty').optional(),
  description: z.string().trim().optional().nullable(),
  status: z.nativeEnum(IssueStatus).optional(),
  priority: z.string().trim().optional().nullable(),
  assigneeUserId: z.string().trim().optional().nullable(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export const issueQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(['title', 'status', 'priority', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.nativeEnum(IssueStatus).optional(),
  projectId: z.string().trim().optional(),
  assigneeUserId: z.string().trim().optional(),
});

export type IssueQueryInput = z.infer<typeof issueQuerySchema>;
