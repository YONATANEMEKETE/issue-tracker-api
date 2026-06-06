import { z } from 'zod';
import { ProjectStatus } from '../../generated/prisma/client.js';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name cannot be empty').optional(),
  description: z.string().trim().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'status', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
