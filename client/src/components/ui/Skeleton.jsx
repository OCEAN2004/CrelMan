import { cn } from "../../lib/utils";

/* CRELMAN loading components */

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border border-violet-100 bg-linear-to-r from-violet-50 via-white to-violet-100 shadow-sm",
        className
      )}
    />
  );
}

/** Centered spinner for loading states. */
export function Spinner({ className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-10",
        className
      )}
    >
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-violet-200" />

        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-600 border-r-violet-500" />
      </div>
    </div>
  );
}