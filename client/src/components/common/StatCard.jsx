import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "../ui";
import { cn } from "../../lib/utils";

/**
 * Premium CRELMAN Card
 * UI redesigned while preserving all existing functionality.
 */
export function StatCard({ label, value, icon: Icon, trend, accent = false }) {
  const positive = trend == null || trend >= 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        accent
          ? "border-violet-500 bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-violet-300/40"
          : "border-violet-100 bg-white/90 backdrop-blur-xl shadow-lg hover:border-violet-200"
      )}
    >
      {/* Decorative Background */}
      {accent && (
        <>
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        </>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
              accent
                ? "bg-white/15 backdrop-blur-md"
                : "bg-linear-to-br from-violet-100 to-purple-100 text-violet-700 group-hover:scale-105"
            )}
          >
            {Icon && <Icon className="h-6 w-6" />}
          </div>

          {trend != null && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                accent
                  ? "bg-white/15 text-white"
                  : positive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Value */}
        <h2
          className={cn(
            "mt-8 text-3xl font-bold tracking-tight",
            accent ? "text-white" : "text-slate-900"
          )}
        >
          {value}
        </h2>

        {/* Label */}
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            accent ? "text-white/75" : "text-slate-500"
          )}
        >
          {label}
        </p>
      </div>
    </Card>
  );
}