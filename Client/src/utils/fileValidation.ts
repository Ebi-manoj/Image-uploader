import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  ALLOWED_FORMATS_DISPLAY,
} from '../constants/imageFormats';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if a file is an allowed image format
 */
export const validateImageFile = (file: File): FileValidationResult => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Invalid file format. Only ${ALLOWED_FORMATS_DISPLAY} are allowed.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Validates multiple files and returns valid files with error messages for invalid ones
 */
export const validateImageFiles = (
  files: File[],
): {
  validFiles: File[];
  errors: string[];
} => {
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach(file => {
    const result = validateImageFile(file);
    if (result.isValid) {
      validFiles.push(file);
    } else {
      errors.push(`${file.name}: ${result.error}`);
    }
  });

  return { validFiles, errors };
};
