import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Premium CRELMAN Dialog & Drawer
 * Functionality preserved. UI redesigned only.
 */

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md animate-[fade-up_.2s_ease]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-violet-200/30 backdrop-blur-xl animate-fade-up no-scrollbar",
          className
        )}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-violet-100 px-6 py-5">
            <div>
              {title && (
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {title}
                </h3>
              )}

              {description && (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Premium CRELMAN Drawer
 */

export function Drawer({
  open,
  onClose,
  title,
  children,
  className,
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-violet-100 bg-white shadow-2xl shadow-violet-200/30 animate-[slidein_.28s_cubic-bezier(.16,1,.3,1)] no-scrollbar",
          className
        )}
        style={{ animationName: "slidein" }}
      >
        <style>{`
          @keyframes slidein{
            from{
              transform:translateX(36px);
              opacity:.7;
            }
            to{
              transform:translateX(0);
              opacity:1;
            }
          }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-violet-100 bg-white/90 px-6 py-5 backdrop-blur-xl">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-violet-600">
              CRELMAN
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}