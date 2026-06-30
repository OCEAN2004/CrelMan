import { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Sparkles,
  Pencil,
  Trash2,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { Drawer, Button, Badge, Avatar, Spinner } from "../ui";
import { AiEmailDialog } from "../ai/AiEmailDialog";
import { aiApi } from "../../lib/services";
import { currency, shortDate } from "../../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

/** Premium CRELMAN lead drawer. */
export function LeadDrawer({ open, onClose, lead, onEdit, onDelete }) {
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  if (!lead) return null;
  const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;

  const runSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await aiApi.leadSummary({ leadId: lead._id });
      setSummary(res);
    } catch (err) {
      toast.error(err.message || "Could not summarize lead");
    } finally {
      setLoadingSummary(false);
    }
  };

  const riskTone =
    summary?.riskScore >= 66
      ? "text-rose-600"
      : summary?.riskScore >= 33
      ? "text-amber-600"
      : "text-violet-700";

  return (
    <>
      <Drawer open={open} onClose={onClose} title="Lead Details">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar name={lead.name} size="lg" />

          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-slate-900">
              {lead.name}
            </h2>

            <p className="truncate text-sm text-slate-500">
              {lead.company || "Independent Business"}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className={stage.badge} dot={stage.dot}>
            {lead.status}
          </Badge>

          <Badge className={PRIORITY_STYLES[lead.priority]}>
            {lead.priority} Priority
          </Badge>

          <Badge>{lead.source}</Badge>
        </div>

        {/* Deal Value */}
        <div className="mt-5 rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-purple-50 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Deal Value
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {currency(lead.value)}
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-5 space-y-2">
          <InfoRow
            icon={Mail}
            value={lead.email}
            href={`mailto:${lead.email}`}
          />

          <InfoRow
            icon={Phone}
            value={lead.phone}
            href={`tel:${lead.phone}`}
          />

          <InfoRow icon={Building2} value={lead.company} />
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="mt-5 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Notes
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-700">
              {lead.notes}
            </p>
          </div>
        )}

        {/* AI Summary */}
        <div className="mt-5 rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-purple-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
              <Sparkles className="h-4 w-4" />
              AI Lead Summary
            </div>

            {!summary && (
              <Button
                size="sm"
                variant="subtle"
                onClick={runSummary}
                loading={loadingSummary}
              >
                Analyze
              </Button>
            )}
          </div>

          {loadingSummary && <Spinner className="p-5" />}

          {summary && (
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-7 text-slate-700">
                {summary.summary}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-violet-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Risk Score
                  </p>

                  <p className={cn("mt-1 text-xl font-bold", riskTone)}>
                    {summary.riskScore}
                    <span className="text-sm text-slate-500">/100</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Suggested Priority
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {summary.suggestedPriority}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Next Best Action:
                  </span>{" "}
                  {summary.nextBestAction}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setEmailOpen(true)}
            className="col-span-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate AI Email
          </Button>

          <Button variant="secondary" onClick={() => onEdit(lead)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

          <Button variant="danger" onClick={() => onDelete(lead)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Added on {shortDate(lead.createdAt)}
        </p>
      </Drawer>

      <AiEmailDialog
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        lead={lead}
      />
    </>
  );
}

function InfoRow({ icon: Icon, value, href }) {
  if (!value) return null;

  const content = (
    <div className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-200 hover:border-violet-100 hover:bg-violet-50">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <Icon className="h-4 w-4" />
      </div>

      <span className="truncate">{value}</span>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}