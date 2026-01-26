import { useState, useRef } from 'react';
import { Upload as UploadIcon, X, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { getCloudinarySignatureApi, saveImagesApi } from '../api/upload';

interface ImageWithTitle {
  id: string;
  file: File;
  preview: string;
  title: string;
}

export default function Upload() {
  const [images, setImages] = useState<ImageWithTitle[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageWithTitle[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      title: '',
    }));

    setImages(prev => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTitleChange = (id: string, title: string) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, title } : img)),
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleUpload = async () => {
    const imagesWithoutTitles = images.filter(img => !img.title.trim());
    if (imagesWithoutTitles.length > 0) {
      toast.error('Please add titles to all images');
      return;
    }

    setIsUploading(true);

    try {
      //  Get Cloudinary signature
      const { signature, timestamp, cloudName, apiKey } =
        await getCloudinarySignatureApi();

      // Upload each image to Cloudinary
      const uploadPromises = images.map(async image => {
        const formData = new FormData();
        formData.append('file', image.file);
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
          throw new Error(`Failed to upload ${image.title}`);
        }

        const data = await response.json();
        return {
          title: image.title,
          url: data.secure_url,
          publicId: data.public_id,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Save image metadata to database
      await saveImagesApi(uploadedImages);

      toast.success(`Successfully uploaded ${images.length} images!`);

      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl p-1 font-bold tracking-tight bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Upload Images
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Select multiple images and add titles for each
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:border-pink-400 hover:bg-pink-50"
          >
            <ImagePlus className="h-12 w-12 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">
              Click to select images
            </p>
            <p className="mt-1 text-xs text-slate-500">
              PNG, JPG, GIF up to 10MB each
            </p>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map(image => (
                <div
                  key={image.id}
                  className="group relative rounded-lg bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-lg"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Image Preview */}
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-slate-100">
                    <img
                      src={image.preview}
                      alt={image.title || 'Preview'}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Title Input */}
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Enter image title..."
                      value={image.title}
                      onChange={e =>
                        handleTitleChange(image.id, e.target.value)
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={isUploading || images.length === 0}
                className="flex items-center gap-2 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    Upload {images.length}{' '}
                    {images.length === 1 ? 'Image' : 'Images'}
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center text-slate-500">
            <p className="text-sm">No images selected yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
