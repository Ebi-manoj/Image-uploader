import { z } from 'zod';

export const resendOtpSchema = z.object({
  email: z.email('Invalid email address'),
  purpose: z.enum(['REGISTRATION', 'FORGOT_PASSWORD'], {
    message: 'Purpose must be either REGISTRATION or FORGOT_PASSWORD',
  }),
});
