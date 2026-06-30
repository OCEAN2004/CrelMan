import { Wifi } from "lucide-react";
import { Card, SectionHeading } from "../ui";
import { currency } from "../../lib/format";

/**
 * The "credit-card" hero from the reference, repurposed for the CRM.
 * Only the colors have been updated to match the CRELMAN lavender theme.
 */
export function HeroCard({ value = 0, label = "Pipeline value" }) {
  return (
    <Card className="p-6">
      <SectionHeading
        title="Pipeline Goal"
        subtitle="Total deal value"
        to="/pipeline"
      />

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-5 text-white shadow-xl shadow-violet-300/30">
        {/* Decorative glow */}
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-violet-300/20 blur-3xl" />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />

        <div className="relative flex items-start justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight">
            CRELMAN
          </span>

          <Wifi className="h-6 w-6 rotate-90 text-violet-100 opacity-90" />
        </div>

        <p className="relative mt-6 text-sm text-violet-100">
          {label}
        </p>

        <p className="relative mt-1 font-display text-3xl font-bold tracking-tight text-white">
          {currency(value)}
        </p>

        <div className="relative mt-6 flex items-center justify-between text-sm">
          <span className="tracking-[0.2em] text-violet-100">
            •••• PIPELINE
          </span>

          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-violet-50 backdrop-blur-sm">
            LIVE
          </span>
        </div>
      </div>
    </Card>
  );
}