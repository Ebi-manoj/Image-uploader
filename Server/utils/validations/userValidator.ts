import { z } from 'zod';

export const userZodSchema = z.object({
  email: z.email('Invalid email format'),

  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits'),

  password: z
    .string()
    .min(6, 'Password must be minimum 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    )
    .refine(val => val.trim().length !== 0, {
      message: 'Password cannot contain only spaces',
    }),
});
