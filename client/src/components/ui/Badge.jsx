import { cn } from "../../lib/utils";

/** Premium CRELMAN badge component. */
export function Badge({ className, dot, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-linear-to-r from-white to-violet-50 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-2 w-2 rounded-full ring-2 ring-white",
            dot
          )}
        />
      )}

      {children}
    </span>
  );
}