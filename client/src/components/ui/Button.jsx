import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

/* Premium CRELMAN Button */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-300/30 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-300/40",

        secondary:
          "border border-violet-100 bg-white text-slate-700 shadow-sm hover:bg-violet-50 hover:border-violet-200",

        outline:
          "border border-violet-200 bg-white text-slate-700 hover:bg-violet-50 hover:border-violet-300",

        ghost:
          "text-slate-600 hover:bg-violet-50 hover:text-violet-700",

        danger:
          "bg-linear-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-200/40 hover:from-rose-600 hover:to-red-700",

        subtle:
          "bg-violet-100 text-violet-700 hover:bg-violet-200",
      },

      size: {
        sm: "h-9 px-3.5",
        md: "h-10 px-5",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-9 w-9 p-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export { buttonVariants };