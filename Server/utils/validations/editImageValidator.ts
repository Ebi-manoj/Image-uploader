import { z } from 'zod';

export const editImageSchema = z.object({
  id: z.string().min(1, 'Image ID is required'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(50, 'Title must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s]+$/,
      'Title can only contain letters and spaces (no numbers or special characters)',
    )
    .transform(val => val.trim()),
  url: z.url('Invalid URL format').optional(),
  public_id: z.string().optional(),
});
