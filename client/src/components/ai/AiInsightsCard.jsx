import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { Card, Button, Spinner } from "../ui";
import { aiApi } from "../../lib/services";
import { toast } from "sonner";

/**
 * AI Sales Insights panel.
 * Redesigned for CRELMAN while preserving all functionality.
 */
export function AiInsightsCard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const res = await aiApi.salesInsights({});
      setData(res);
    } catch (err) {
      toast.error(err.message || "Could not generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col rounded-3xl border border-violet-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-purple-100 to-indigo-100 text-violet-700 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              AI Sales Insights
            </h3>

            <p className="text-xs text-slate-500">
              AI-powered pipeline analysis
            </p>
          </div>
        </div>

        {data && (
          <button
            onClick={run}
            title="Refresh Insights"
            className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : !data ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="max-w-xs text-sm leading-6 text-slate-500">
            Get instant insights into your sales pipeline and discover the next
            best actions for your business.
          </p>

          <Button
            className="mt-5"
            size="sm"
            onClick={run}
          >
            <Sparkles className="h-4 w-4" />
            Analyze Pipeline
          </Button>
        </div>
      ) : (
        <div className="mt-5 flex-1 space-y-5 overflow-y-auto no-scrollbar">
          {/* Health Score */}
          <div className="rounded-3xl border border-violet-100 bg-linear-to-br from-violet-50 via-purple-50 to-indigo-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                Pipeline Health
              </span>

              <span className="text-2xl font-black text-violet-700">
                {data.healthScore}/100
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 transition-all duration-500"
                style={{ width: `${data.healthScore}%` }}
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700">
              {data.headline}
            </p>
          </div>

          <Section
            icon={TrendingUp}
            title="Key Observations"
            items={data.insights}
          />

          <Section
            icon={Lightbulb}
            title="Recommendations"
            items={data.recommendations}
          />
        </div>
      )}
    </Card>
  );
}

function Section({ icon: Icon, title, items = [] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Icon className="h-4 w-4" />
        </div>

        {title}
      </div>

      <ul className="space-y-3">
        {items.map((t, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm leading-6 text-slate-600"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}