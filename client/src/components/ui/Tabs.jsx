import { cn } from "../../lib/utils";

/**
 *  CRELMAN segmented tabs.
 * Controlled: pass `value`, `onChange`, and an array of { value, label } tabs.
 * Functionality preserved. UI redesigned only.
 */
export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl border border-violet-100 bg-white p-1.5 shadow-sm",
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;

        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
              active
                ? "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-300/30"
                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}