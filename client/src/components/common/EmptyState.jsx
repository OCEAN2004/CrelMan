import { Inbox } from "lucide-react";

/** Premium CRELMAN empty-state placeholder with optional action. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-violet-100 bg-white/70 px-6 py-16 text-center shadow-lg backdrop-blur-sm">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-purple-100 to-indigo-100 text-violet-600 shadow-md ring-1 ring-violet-200 transition-all duration-300 hover:scale-105">
        <Icon className="h-7 w-7" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}