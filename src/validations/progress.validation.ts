import { z } from 'zod';

export const toggleProgressSchema = z.object({
  body: z.object({
    problemId: z
      .string()
      .min(1, 'Problem ID is required')
      .regex(/^[a-f\d]{24}$/i, 'Invalid problem ID format'),
  }),
});

export const updateNotesSchema = z.object({
  body: z.object({
    problemId: z
      .string()
      .min(1, 'Problem ID is required')
      .regex(/^[a-f\d]{24}$/i, 'Invalid problem ID format'),
    notes: z
      .string()
      .min(0)
      .max(5000, 'Notes cannot exceed 5000 characters'),
  }),
});

export const toggleBookmarkSchema = z.object({
  body: z.object({
    problemId: z
      .string()
      .min(1, 'Problem ID is required')
      .regex(/^[a-f\d]{24}$/i, 'Invalid problem ID format'),
  }),
});

export type ToggleProgressInput = z.infer<typeof toggleProgressSchema>['body'];
export type UpdateNotesInput = z.infer<typeof updateNotesSchema>['body'];
export type ToggleBookmarkInput = z.infer<typeof toggleBookmarkSchema>['body'];
