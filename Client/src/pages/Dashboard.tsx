import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  getImagesApi,
  updateImageOrderApi,
  deleteImageApi,
} from '../api/upload';
import type { ImageResDTO } from '../types/user';
import { EditImageModal } from '../components/EditImageModal';

interface SortableImageCardProps {
  image: ImageResDTO;
  onEdit: (image: ImageResDTO) => void;
  onDelete: (id: string) => void;
}

const SortableImageCard = ({
  image,
  onEdit,
  onDelete,
}: SortableImageCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative cursor-grab active:cursor-grabbing"
    >
      <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-xl">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img
            src={image.url}
            alt={image.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            draggable={false}
          />
        </div>

        {/* Title */}
        <div className="p-3">
          <h3 className="truncate text-sm font-medium text-slate-800">
            {image.title}
          </h3>
        </div>

        {/* Hover Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              onEdit(image);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 transition hover:bg-slate-100"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [images, setImages] = useState<ImageResDTO[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<ImageResDTO | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Fetch images
  const fetchImages = useCallback(
    async (pageNum: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const data = await getImagesApi({ page: pageNum });
        setImages(prev =>
          pageNum === 1 ? data.images : [...prev, ...data.images],
        );
        setHasMore(data.images.length !== 0);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading],
  );

  // Initial load
  useEffect(() => {
    fetchImages(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        console.log(entries);
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchImages(page);
    }
  }, [page]);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex);
    setImages(newImages);

    // Update order on server
    try {
      const imageOrders = newImages.map((img, index) => ({
        id: img.id,
        order: index,
      }));
      await updateImageOrderApi(imageOrders);
      toast.success('Image order updated');
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update image order');
      // Revert on error
      setImages(images);
    }
  };

  // Handle edit
  const handleEdit = (image: ImageResDTO) => {
    setEditingImage(image);
  };

  // Handle edit success
  const handleEditSuccess = (updatedImage: ImageResDTO) => {
    setImages(prev =>
      prev.map(img => (img.id === updatedImage.id ? updatedImage : img)),
    );
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteImageApi(id);
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl p-1 font-bold tracking-tight bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            My Images
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Drag and drop to reorder your images
          </p>
        </div>

        {/* Image Grid */}
        {images.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {images.map(image => (
                  <SortableImageCard
                    key={image.id}
                    image={image}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-slate-600">No images yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Upload some images to get started
            </p>
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {hasMore && (
          <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
            {loading && (
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            )}
          </div>
        )}

        {/* End message */}
        {!hasMore && images.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
            You've reached the end
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
