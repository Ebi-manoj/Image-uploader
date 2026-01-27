import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ImageResDTO } from '../types/user';
import { imageTitleSchema } from '../validations/imageValidation';
import { validateImageFile } from '../utils/fileValidation';
import { getCloudinarySignatureApi, editImageApi } from '../api/upload';
import { ZodError } from 'zod';

interface EditImageModalProps {
  image: ImageResDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedImage: ImageResDTO) => void;
}

export const EditImageModal = ({
  image,
  isOpen,
  onClose,
  onSuccess,
}: EditImageModalProps) => {
  const [title, setTitle] = useState(image.title);
  const [titleError, setTitleError] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(image.url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateTitle = (value: string): string | undefined => {
    try {
      imageTitleSchema.parse(value);
      return undefined;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return error.issues?.[0]?.message || 'Invalid title';
      }
      return 'Invalid title';
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (value.trim()) {
      setTitleError(validateTitle(value));
    } else {
      setTitleError(undefined);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title
    const error = validateTitle(title);
    if (error) {
      setTitleError(error);
      toast.error('Please fix validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      let newUrl = image.url;
      let newPublicId = image.publicId;

      if (selectedFile) {
        const { signature, timestamp, cloudName, apiKey } =
          await getCloudinarySignatureApi();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', 'image-uploader');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        newUrl = data.secure_url;
        newPublicId = data.public_id;
      }

      const updatedImage = await editImageApi(image.id, {
        title,
        url: newUrl !== image.url ? newUrl : undefined,
        public_id: newPublicId !== image.publicId ? newPublicId : undefined,
      });

      toast.success('Image updated successfully');
      onSuccess(updatedImage);
      onClose();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (selectedFile && previewUrl !== image.url) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[70vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-slate-800">Edit Image</h2>
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-full p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto p-4">
            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title-input"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Title
              </label>
              <input
                id="title-input"
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Enter image title (letters only, min 3 chars)..."
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  titleError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              {titleError && (
                <p className="mt-1 text-xs text-red-600">{titleError}</p>
              )}
            </div>

            {/* File Input */}
            <div className="mb-4">
              <label
                htmlFor="file-input"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Change Image (Optional)
              </label>
              <input
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                onChange={handleFileSelect}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, GIF, WEBP, SVG (max 10MB)
              </p>
            </div>

            {/* Image Preview */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Image Preview
              </label>
              <div className="relative max-h-48 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={previewUrl}
                  alt={title || 'Preview'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="shrink-0 border-t p-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="cursor-pointer flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !!titleError}
                className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
