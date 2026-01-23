import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid Credintails'),
  password: z.string().min(6, 'Invalid Credintails'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
