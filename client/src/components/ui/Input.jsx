import { forwardRef } from "react";
import { cn } from "../../lib/utils";

//  CRELMAN Form Controls 

const baseField =
  "w-full rounded-2xl border border-violet-200 bg-white/90 px-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-60";

export const Input = forwardRef(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(baseField, "h-11", className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        baseField,
        "resize-none py-3 leading-relaxed",
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        baseField,
        "h-11 appearance-none bg-no-repeat pr-10",
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%237c3aed' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 1rem center",
      }}
      {...props}
    >
      {children}
    </select>
  );
});

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn(
        "mb-2 block text-sm font-semibold tracking-wide text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

/* Field wrapper with optional validation message */
export function Field({ label, error, children, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}

      {children}

      {error && (
        <p className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}