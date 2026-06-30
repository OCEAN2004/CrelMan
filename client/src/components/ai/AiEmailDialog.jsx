import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Mail,
} from "lucide-react";
import {
  Dialog,
  Button,
  Field,
  Select,
  Textarea,
  Spinner,
} from "../ui";
import { aiApi } from "../../lib/services";
import { toast } from "sonner";

/**
 * AI email generator dialog.
 * Generates an editable email draft while preserving all existing logic.
 */
export function AiEmailDialog({ open, onClose, lead }) {
  const [purpose, setPurpose] = useState("Follow-up");
  const [tone, setTone] = useState("Friendly & professional");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);

    try {
      const res = await aiApi.generateEmail({
        leadId: lead._id,
        purpose,
        tone,
      });

      setDraft({
        subject: res.subject,
        body: res.body,
      });
    } catch (err) {
      toast.error(err.message || "Could not generate email");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(
      `Subject: ${draft.subject}\n\n${draft.body}`
    );

    setCopied(true);
    toast.success("Email copied to clipboard");

    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="AI Email Generator"
      description={`Create a professional email for ${lead?.name}`}
    >
      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Purpose">
          <Select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="rounded-2xl border-violet-200 focus:border-violet-500"
          >
            {[
              "Follow-up",
              "Sales pitch",
              "Meeting request",
              "Re-engagement",
              "Thank you",
            ].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>

        <Field label="Tone">
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="rounded-2xl border-violet-200 focus:border-violet-500"
          >
            {[
              "Friendly & professional",
              "Formal",
              "Concise & direct",
              "Warm & casual",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Generate Button */}
      <Button
        className="mt-5 w-full rounded-2xl bg-linear-to-r from-violet-800 via-purple-600 to-violet-400 shadow-lg shadow-violet-300/30 transition-all duration-300 hover:scale-[1.01]"
        onClick={generate}
        loading={loading}
      >
        <Wand2 className="h-4 w-4" />
        {draft ? "Regenerate Email" : "Generate Email"}
      </Button>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {/* Draft */}
      {draft && !loading && (
        <div className="mt-6 space-y-4 animate-fade-up">
          <Field label="Subject">
            <input
              value={draft.subject}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  subject: e.target.value,
                })
              }
              placeholder="Enter email subject"
              className="h-11 w-full rounded-2xl border border-violet-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </Field>

          <Field label="Email">
            <Textarea
              rows={9}
              value={draft.body}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  body: e.target.value,
                })
              }
              placeholder="AI-generated email will appear here..."
              className="rounded-2xl border-violet-200"
            />
          </Field>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={copy}
              className="rounded-2xl border-violet-200 hover:bg-violet-50"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}

              {copied ? "Copied" : "Copy Email"}
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      {!draft && !loading && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-xs font-medium text-violet-700">
          <Mail className="h-4 w-4" />
          <Sparkles className="h-4 w-4" />
          AI-powered email generation for smarter customer communication.
        </div>
      )}
    </Dialog>
  );
}