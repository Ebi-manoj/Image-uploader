import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 border-b p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              variant === 'danger' ? 'bg-red-100' : 'bg-orange-100'
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${
                variant === 'danger' ? 'text-red-600' : 'text-orange-600'
              }`}
            />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>

        {/* Message */}
        <div className="p-4">
          <p className="text-sm text-slate-600">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t p-4">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
