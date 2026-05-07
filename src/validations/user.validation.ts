import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
