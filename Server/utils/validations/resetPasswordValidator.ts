import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.email('Invalid email'),
  });
