import { z } from 'zod';


export const imageTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .transform(val => val.trim())
  .pipe(
    z
      .string()
      .min(3, 'Title must be at least 3 characters long')
      .max(50, 'Title must not exceed 50 characters')
      .regex(
        /^[a-zA-Z\s]+$/,
        'Title can only contain letters and spaces (no numbers or special characters)',
      ),
  );

// Image upload schema
export const imageUploadSchema = z.object({
  title: imageTitleSchema,
});

export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
