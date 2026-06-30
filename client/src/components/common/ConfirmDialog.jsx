import { AlertTriangle } from "lucide-react";
import { Dialog, Button } from "../ui";

// Premium confirmation modal
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  loading = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-linear-to-br from-rose-50 via-red-50 to-orange-50 text-rose-600 shadow-sm">
          <AlertTriangle className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-7 flex w-full gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl border-violet-200 bg-white hover:border-violet-300 hover:bg-violet-50"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            className="flex-1 rounded-2xl shadow-lg shadow-rose-200/40"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}