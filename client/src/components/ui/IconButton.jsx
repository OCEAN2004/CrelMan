import { cn } from "../../lib/utils";

/**
 * Premium CRELMAN Icon Button
 * Redesigned UI while preserving all functionality.
 */
export function IconButton({
  className,
  variant = "outline",
  children,
  ...props
}) {
  const variants = {
    outline:
      "border border-violet-100 bg-white text-slate-500 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md",

    ghost:
      "text-slate-500 hover:bg-violet-50 hover:text-violet-700",

    solid:
      "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-300/30 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-xl",

    muted:
      "bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700",
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}