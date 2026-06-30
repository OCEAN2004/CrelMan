import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  StickyNote,
  Link2,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import {
  Button,
  Card,
  Textarea,
  Select,
  Field,
  Badge,
  Dialog,
  Dropdown,
  DropdownItem,
  Spinner,
} from "../components/ui";
import { notesApi, leadsApi } from "../lib/services";
import { relative } from "../lib/format";
import { cn } from "../lib/utils";

/* ───────────────── KPI Card ───────────────── */

function StatTile({
  icon: Icon,
  label,
  value,
  tint,
}) {
  return (
    <Card className="rounded-3xl border border-violet-100 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm",
            tint
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>

          <p className="mt-1 font-display text-2xl font-black text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────── Filter Chip ───────────────── */

function FilterChip({
  label,
  count,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
        active
          ? "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border-transparent shadow-lg"
          : "border-violet-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700"
      )}
    >
      {label}

      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-bold",
          active
            ? "bg-white/20 text-white"
            : "bg-violet-100 text-violet-700"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ───────────────── Note Card ───────────────── */

function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  const entity =
    note.lead ??
    note.contact ??
    null;

  return (
    <div
  className={cn(
    "break-inside-avoid relative flex flex-col gap-3 overflow-visible rounded-2xl bg-surface p-5",
    "border border-line shadow-(--shadow-card) transition hover:shadow-(--shadow-pop)",
    note.pinned && "ring-1 ring-brand-200"
      )}
    >
      {/* {note.pinned && (
        <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500" />
      )} */}

      {note.pinned && (
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <Pin className="h-4 w-4" />
        </div>
      )}

      <p className="pr-7 text-sm leading-7 whitespace-pre-wrap text-slate-700">
        {note.content}
      </p>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {entity && (
            <Badge className="max-w-45 truncate border border-violet-200 bg-violet-100 text-violet-700">
              <Link2 className="mr-1 h-3 w-3 shrink-0" />
              <span className="truncate">
                {entity.name}
              </span>
            </Badge>
          )}

          <span className="text-xs text-slate-500">
            {relative(
              note.createdAt
            )}
          </span>
        </div>

        <Dropdown
          trigger={
            <button className="rounded-xl p-2 text-slate-400 transition hover:bg-violet-100 hover:text-violet-700">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem
            onClick={() =>
              onTogglePin(note)
            }
          >
            {note.pinned ? (
              <>
                <PinOff className="h-4 w-4" />
                Unpin
              </>
            ) : (
              <>
                <Pin className="h-4 w-4" />
                Pin
              </>
            )}
          </DropdownItem>

          <DropdownItem
            onClick={() =>
              onEdit(note)
            }
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownItem>

          <DropdownItem
            danger
            onClick={() =>
              onDelete(note)
            }
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}

/* ───────────────── Note Form Dialog ───────────────── */

function NoteFormDialog({
  open,
  onClose,
  note,
  leads,
  onSaved,
}) {
  const isEditing =
    Boolean(note);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

    // Reset form whenever the dialog opens or the note being edited changes
  useEffect(() => {
    if (open) {
      reset({
        content: note?.content ?? "",
        lead: note?.lead?._id ?? "",
        pinned: note?.pinned ?? false,
      });
    }
  }, [open, note, reset]);

  const onSubmit = async (values) => {
    const payload = {
      content: values.content,
      pinned: values.pinned,
      lead: values.lead || undefined,
    };

    try {
      if (isEditing) {
        await notesApi.update(note._id, payload);
        toast.success("Note updated");
      } else {
        await notesApi.create(payload);
        toast.success("Note created");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message ?? "Could not save note");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Note" : "Create Note"}
      description={
        isEditing
          ? "Update your note details."
          : "Capture important business information for future reference."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 flex flex-col gap-5"
      >
        {/* Note */}
        <Field label="Note" error={errors.content?.message}>
          <Textarea
            rows={6}
            placeholder="Example: Follow up with Rajesh regarding invoice approval next Monday..."
            {...register("content", {
              required: "Note content is required.",
            })}
          />
        </Field>

        {/* Lead */}
        <Field label="Linked Lead">
          <Select {...register("lead")}>
            <option value="">No linked lead</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name}
                {lead.company ? ` • ${lead.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        {/* Pin Toggle */}
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50/40 p-4 transition hover:bg-violet-50">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("pinned")}
            />

            <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-linear-to-r peer-checked:from-violet-500 peer-checked:to-purple-600" />

            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </div>

          <div>
            <p className="font-medium text-slate-900">
              Pin this note
            </p>
            <p className="text-sm text-slate-500">
              Pinned notes always stay at the top.
            </p>
          </div>
        </label>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="flex-1"
            loading={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Create Note"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/* ─────────────────────────────── Notes Page ─────────────────────────────── */

export default function Notes() {
  /* Data */
  const [notes, setNotes] = useState(null);
  const [leads, setLeads] = useState([]);

  /* UI State */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* Load */
  const load = () => {
    setNotes(null);

    notesApi
      .list()
      .then((res) => setNotes(res.notes))
      .catch(() => setNotes([]));
  };

  useEffect(() => {
    load();

    leadsApi
      .list()
      .then((res) => setLeads(res.leads ?? []))
      .catch(() => {});
  }, []);

  /* KPIs */
  const kpis = useMemo(() => {
    const list = notes || [];

    return {
      total: list.length,
      pinned: list.filter((n) => n.pinned).length,
      linked: list.filter((n) => n.lead || n.contact).length,
      unlinked: list.filter((n) => !n.lead && !n.contact).length,
    };
  }, [notes]);

  /* Filter Counts */
  const chipCounts = useMemo(
    () => ({
      all: kpis.total,
      pinned: kpis.pinned,
      linked: kpis.linked,
      unlinked: kpis.unlinked,
    }),
    [kpis]
  );

  /* Search + Filter */
  const filtered = useMemo(() => {
    if (!notes) return [];

    let list = notes;

    if (filter === "pinned")
      list = list.filter((n) => n.pinned);

    else if (filter === "linked")
      list = list.filter((n) => n.lead || n.contact);

    else if (filter === "unlinked")
      list = list.filter((n) => !n.lead && !n.contact);

    if (search.trim()) {
      const query = search.toLowerCase();

      list = list.filter((n) =>
        n.content?.toLowerCase().includes(query)
      );
    }

    return list;
  }, [notes, filter, search]);

  const isActive =
    search.trim() || filter !== "all";

  /* Handlers */

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleTogglePin = async (note) => {
    try {
      await notesApi.update(note._id, {
        pinned: !note.pinned,
      });

      toast.success(
        note.pinned
          ? "Note unpinned"
          : "Note pinned"
      );

      load();
    } catch (err) {
      toast.error(
        err.message ??
          "Couldn't update note"
      );
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await notesApi.remove(toDelete._id);

      toast.success("Note deleted");

      setToDelete(null);

      load();
    } catch (err) {
      toast.error(
        err.message ??
          "Couldn't delete note"
      );
    } finally {
      setDeleting(false);
    }
  };

  const clearAll = () => {
    setSearch("");
    setFilter("all");
  };
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader title="Notes" subtitle="Capture context across your deals and contacts.">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New note
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={StickyNote}
          tint="bg-brand-50 text-brand-600"
          label="Total notes"
          value={kpis.total}
        />
        <StatTile
          icon={Pin}
          tint="bg-amber-50 text-amber-600"
          label="Pinned"
          value={kpis.pinned}
        />
        <StatTile
          icon={Link2}
          tint="bg-sky-50 text-sky-600"
          label="Linked"
          value={kpis.linked}
        />
        <StatTile
          icon={FileText}
          tint="bg-slate-50 text-slate-500"
          label="Unlinked"
          value={kpis.unlinked}
        />
      </div>

      {/* Toolbar */}
      <Card className="space-y-4 p-4">
        {/* Search row */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Quick-filter chips + result count */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="All"
            count={chipCounts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterChip
            label="Pinned"
            count={chipCounts.pinned}
            active={filter === "pinned"}
            onClick={() => setFilter("pinned")}
          />
          <FilterChip
            label="Linked"
            count={chipCounts.linked}
            active={filter === "linked"}
            onClick={() => setFilter("linked")}
          />
          <FilterChip
            label="Unlinked"
            count={chipCounts.unlinked}
            active={filter === "unlinked"}
            onClick={() => setFilter("unlinked")}
          />

          <div className="ml-auto flex items-center gap-3">
            {isActive && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
              {notes?.length ?? 0}
            </span>
          </div>
        </div>
      </Card>

      {/* Masonry grid / loading / empty */}
      {notes === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={isActive ? "No notes match" : "No notes yet"}
          description={
            isActive
              ? "Try adjusting your search or filters."
              : "Start capturing context for your leads and deals."
          }
          action={
            !isActive ? (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" /> New note
              </Button>
            ) : undefined
          }
        />
      ) : (
        /* Masonry via CSS columns */
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 *:mb-4">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setToDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {/* New / Edit dialog */}
      <NoteFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        note={editing}
        leads={leads}
        onSaved={handleSaved}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this note?"
        description="This note will be permanently removed and cannot be recovered."
        confirmLabel="Delete note"
      />
    </div>
  );
}
