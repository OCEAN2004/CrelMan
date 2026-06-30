import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

/* Premium CRELMAN Card primitives */

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-violet-100/80 bg-white/85 shadow-lg shadow-violet-100/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-violet-200/40",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 p-6 pb-0",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-base font-bold tracking-tight text-slate-900",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        "mt-1 text-sm leading-6 text-slate-500",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("p-6", className)}
      {...props}
    />
  );
}

/**
 * Premium CRELMAN section heading.
 * Logic preserved, only UI redesigned.
 */
export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  to,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-700 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action ??
        (to ? (
          <Link
            to={to}
            aria-label="Open"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md active:scale-95"
          >
            <ArrowUpRight className="h-4.5 w-4.5" />
          </Link>
        ) : null)}
    </div>
  );
}