
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;


export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
] as const;


export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_FORMATS_DISPLAY = 'JPG, JPEG, PNG, GIF, WEBP, SVG';
