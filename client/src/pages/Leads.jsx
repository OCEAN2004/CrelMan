import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  TrendingUp,
  Trophy,
  Coins,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  LayoutGrid,
  Table2,
  Download,
  Building2,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { LeadFormDialog } from "../components/leads/LeadFormDialog";
import { LeadDrawer } from "../components/leads/LeadDrawer";
import {
  Card,
  Button,
  Badge,
  Avatar,
  Select,
  Dropdown,
  DropdownItem,
  Spinner,
} from "../components/ui";
import { leadsApi } from "../lib/services";
import { currency, relative } from "../lib/format";
import {
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  STAGE_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export default function Leads() {
  const [leads, setLeads] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    source: "",
    search: "",
  });

  const [sort, setSort] = useState({
    key: "updatedAt",
    dir: "desc",
  });

  const [selected, setSelected] = useState(
    () => new Set()
  );

  const [view, setView] = useState("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLeads(null);
    setSelected(new Set());

    leadsApi
      .list()
      .then((res) => setLeads(res.leads))
      .catch(() => setLeads([]));
  };

  useEffect(load, []);

  /* ───────────────── KPIs ───────────────── */

  const stageCounts = useMemo(() => {
    const counts = {
      All: leads?.length || 0,
    };

    LEAD_STAGES.forEach(
      (stage) => (counts[stage] = 0)
    );

    (leads || []).forEach(
      (lead) =>
        (counts[lead.status] =
          (counts[lead.status] || 0) + 1)
    );

    return counts;
  }, [leads]);

  const kpis = useMemo(() => {
    const list = leads || [];

    const openDeals = list.filter(
      (lead) =>
        lead.status !== "Won" &&
        lead.status !== "Lost"
    );

    const openValue = openDeals.reduce(
      (sum, lead) =>
        sum + (lead.value || 0),
      0
    );

    const wonValue = list
      .filter(
        (lead) => lead.status === "Won"
      )
      .reduce(
        (sum, lead) =>
          sum + (lead.value || 0),
        0
      );

    const totalValue = list.reduce(
      (sum, lead) =>
        sum + (lead.value || 0),
      0
    );

    return {
      count: list.length,
      openValue,
      wonValue,
      avg: list.length
        ? Math.round(
            totalValue / list.length
          )
        : 0,
    };
  }, [leads]);

  /* ───────────────── Filtering ───────────────── */

  const filtered = useMemo(() => {
    if (!leads) return [];

    return leads.filter((lead) => {
      if (
        filters.status &&
        lead.status !== filters.status
      )
        return false;

      if (
        filters.priority &&
        lead.priority !==
          filters.priority
      )
        return false;

      if (
        filters.source &&
        lead.source !== filters.source
      )
        return false;

      if (filters.search) {
        const query =
          filters.search.toLowerCase();

        return (
          lead.name
            ?.toLowerCase()
            .includes(query) ||
          lead.company
            ?.toLowerCase()
            .includes(query) ||
          lead.email
            ?.toLowerCase()
            .includes(query)
        );
      }

      return true;
    });
  }, [leads, filters]);

  /* ───────────────── Sorting ───────────────── */

  const sorted = useMemo(() => {
    const arr = [...filtered];

    const { key, dir } = sort;

    arr.sort((a, b) => {
      let av;
      let bv;

      if (key === "name") {
        av =
          a.name?.toLowerCase() || "";
        bv =
          b.name?.toLowerCase() || "";
      } else if (key === "value") {
        av = a.value || 0;
        bv = b.value || 0;
      } else {
        av = new Date(
          a.updatedAt
        ).getTime();

        bv = new Date(
          b.updatedAt
        ).getTime();
      }

      if (av < bv)
        return dir === "asc"
          ? -1
          : 1;

      if (av > bv)
        return dir === "asc"
          ? 1
          : -1;

      return 0;
    });

    return arr;
  }, [filtered, sort]);

  const filtersActive =
    filters.status ||
    filters.priority ||
    filters.source ||
    filters.search;

  /* ───────────────── Handlers ───────────────── */

  const toggleSort = (key) =>
    setSort((current) =>
      current.key === key
        ? {
            key,
            dir:
              current.dir === "asc"
                ? "desc"
                : "asc",
          }
        : {
            key,
            dir:
              key === "name"
                ? "asc"
                : "desc",
          }
    );

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (lead) => {
    setDrawerLead(null);
    setEditing(lead);
    setFormOpen(true);
  };

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);

      next.has(id)
        ? next.delete(id)
        : next.add(id);

      return next;
    });

  const allVisibleSelected =
    sorted.length > 0 &&
    sorted.every((lead) =>
      selected.has(lead._id)
    );

  const toggleAll = () =>
    setSelected(
      allVisibleSelected
        ? new Set()
        : new Set(
            sorted.map(
              (lead) => lead._id
            )
          )
    );

  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await leadsApi.remove(
        toDelete._id
      );

      toast.success(
        "Lead deleted successfully"
      );

      setToDelete(null);
      setDrawerLead(null);

      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const confirmBulkDelete =
    async () => {
      setDeleting(true);

      try {
        await Promise.all(
          [...selected].map((id) =>
            leadsApi.remove(id)
          )
        );

        toast.success(
          `${selected.size} leads deleted`
        );

        setBulkOpen(false);

        load();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setDeleting(false);
      }
    };

  /* ───────────────── CSV Export ───────────────── */

  const exportCSV = () => {
    const rows =
      selected.size > 0
        ? sorted.filter((lead) =>
            selected.has(lead._id)
          )
        : sorted;

    if (!rows.length) {
      toast.error(
        "No leads available to export."
      );
      return;
    }

    const headers = [
      "Name",
      "Company",
      "Email",
      "Phone",
      "Stage",
      "Priority",
      "Source",
      "Value",
      "Created",
      "Updated",
    ];
    // Escape values containing commas, quotes or newlines per RFC 4180.
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
    const lines = [headers.join(",")];
    rows.forEach((l) =>
      lines.push(
        [
          l.name, l.company, l.email, l.phone, l.status,
          l.priority, l.source, l.value, day(l.createdAt), day(l.updatedAt),
        ]
          .map(esc)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} ${rows.length === 1 ? "lead" : "leads"}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" subtitle="Track and qualify every opportunity.">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add lead
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Users} tint="bg-brand-50 text-brand-600" label="Total leads" value={kpis.count} />
        <StatTile
          icon={TrendingUp}
          tint="bg-sky-50 text-sky-600"
          label="Open pipeline"
          value={currency(kpis.openValue, { compact: true })}
        />
        <StatTile
          icon={Trophy}
          tint="bg-emerald-50 text-emerald-600"
          label="Won value"
          value={currency(kpis.wonValue, { compact: true })}
        />
        <StatTile
          icon={Coins}
          tint="bg-violet-50 text-violet-600"
          label="Avg deal size"
          value={currency(kpis.avg, { compact: true })}
        />
      </div>

      {/* Toolbar */}
      <Card className="space-y-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, company or email…"
              className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <Filter
              value={filters.priority}
              onChange={(v) => setFilters({ ...filters, priority: v })}
              all="All priority"
              options={LEAD_PRIORITIES}
            />
            <Filter
              value={filters.source}
              onChange={(v) => setFilters({ ...filters, source: v })}
              all="All sources"
              options={LEAD_SOURCES}
            />
          </div>
        </div>

        {/* Stage quick-filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <StageChip
            label="All"
            count={stageCounts.All}
            active={!filters.status}
            onClick={() => setFilters({ ...filters, status: "" })}
          />
          {LEAD_STAGES.map((s) => (
            <StageChip
              key={s}
              label={s}
              count={stageCounts[s]}
              dot={STAGE_STYLES[s]?.dot}
              active={filters.status === s}
              onClick={() => setFilters({ ...filters, status: s })}
            />
          ))}

          <div className="ml-auto flex items-center gap-3">
            {filtersActive && (
              <button
                onClick={() => setFilters({ status: "", priority: "", source: "", search: "" })}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{sorted.length}</span> of{" "}
              {leads?.length ?? 0}
            </span>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </Card>

      {/* Results */}
{leads === null ? (
  <Card className="flex h-72 items-center justify-center rounded-3xl">
    <Spinner />
  </Card>
) : sorted.length === 0 ? (
  <Card className="rounded-3xl">
    <EmptyState
      icon={Users}
      title="No leads found"
      description={
        filtersActive
          ? "Try changing your filters or search."
          : "Start by adding your first lead to CRELMAN."
      }
      action={
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      }
    />
  </Card>
) : view === "grid" ? (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
    {sorted.map((l) => (
      <LeadGridCard
        key={l._id}
        lead={l}
        selected={selected.has(l._id)}
        onToggle={() => toggleRow(l._id)}
        onOpen={() => setDrawerLead(l)}
        onEdit={openEdit}
        onDelete={setToDelete}
      />
    ))}
  </div>
) : (
  <Card className="overflow-hidden rounded-3xl border border-line shadow-(--shadow-card)">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface-muted/50">
          <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">
            <th className="w-12 pl-6">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-line accent-brand-600"
              />
            </th>

            <SortTh
              label="Lead"
              k="name"
              sort={sort}
              onSort={toggleSort}
            />

            <th className="px-6 py-4 font-medium">Stage</th>

            <th className="px-6 py-4 font-medium">Priority</th>

            <th className="px-6 py-4 font-medium">Source</th>

            <SortTh
              label="Value"
              k="value"
              sort={sort}
              onSort={toggleSort}
              align="right"
            />

            <SortTh
              label="Updated"
              k="updatedAt"
              sort={sort}
              onSort={toggleSort}
            />

            <th className="w-20 px-6 py-4" />
          </tr>
        </thead>

        <tbody>
          {sorted.map((l) => {
            const stage =
              STAGE_STYLES[l.status] || STAGE_STYLES.New;

            const isSel = selected.has(l._id);

            return (
              <tr
                key={l._id}
                onClick={() => setDrawerLead(l)}
                className={cn(
                  "group cursor-pointer border-b border-line transition-all duration-200 last:border-0",
                  isSel
                    ? "bg-brand-50/50"
                    : "hover:bg-surface-muted/70"
                )}
              >
                <td
                  className="pl-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleRow(l._id)}
                    className="h-4 w-4 rounded border-line accent-brand-600"
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={l.name} size="sm" />

                    <div>
                      <p className="font-semibold text-ink">
                        {l.name}
                      </p>

                      <p className="text-xs text-ink-soft">
                        {l.company || l.email || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge
                    className={stage.badge}
                    dot={stage.dot}
                  >
                    {l.status}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <Badge
                    className={PRIORITY_STYLES[l.priority]}
                  >
                    {l.priority}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-xl bg-surface-muted px-3 py-1 text-xs font-medium text-ink-soft">
                    {l.source}
                  </span>
                </td>

                <td className="px-6 py-4 text-right font-semibold text-ink">
                  {currency(l.value)}
                </td>

                <td className="px-6 py-4 text-sm text-ink-soft">
                  {relative(l.updatedAt)}
                </td>

                <td
                  className="px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <ChevronRight className="h-4 w-4 text-ink-soft opacity-0 transition group-hover:opacity-100" />

                    <Dropdown
                      trigger={
                        <button className="rounded-xl p-2 text-ink-soft transition hover:bg-surface-muted hover:text-ink">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => openEdit(l)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownItem>

                      <DropdownItem
                        danger
                        onClick={() => setToDelete(l)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Card>
)}

  {/* Floating Bulk Actions */}
{selected.size > 0 && (
  <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-3 shadow-(--shadow-pop) backdrop-blur-md animate-fade-up">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Users className="h-4 w-4" />
      </div>

      <span className="text-sm font-semibold text-ink">
        {selected.size} selected
      </span>
    </div>

    <div className="h-6 w-px bg-line" />

    <button
      onClick={() => setSelected(new Set())}
      className="text-sm font-medium text-ink-soft transition hover:text-ink"
    >
      Clear Selection
    </button>

    <Button
      size="sm"
      variant="danger"
      onClick={() => setBulkOpen(true)}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  </div>
)}

{/* Dialogs */}
<LeadFormDialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  lead={editing}
  onSaved={load}
/>

<LeadDrawer
  open={Boolean(drawerLead)}
  onClose={() => setDrawerLead(null)}
  lead={drawerLead}
  onEdit={openEdit}
  onDelete={setToDelete}
/>

<ConfirmDialog
  open={Boolean(toDelete)}
  onClose={() => setToDelete(null)}
  onConfirm={confirmDelete}
  loading={deleting}
  title="Delete this lead?"
  description={`"${toDelete?.name}" will be permanently removed.`}
/>

<ConfirmDialog
  open={bulkOpen}
  onClose={() => setBulkOpen(false)}
  onConfirm={confirmBulkDelete}
  loading={deleting}
  title={`Delete ${selected.size} leads?`}
  description="These leads will be permanently removed and cannot be recovered."
/>
</div>
  )};
/* ── Table / grid view toggle ───────────────────────────────────────── */
function ViewToggle({ view, onChange }) {
  const options = [
    {
      value: "table",
      icon: Table2,
      label: "Table",
    },
    {
      value: "grid",
      icon: LayoutGrid,
      label: "Cards",
    },
  ];

  return (
    <div className="flex items-center rounded-2xl border border-line bg-surface-muted p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
            view === value
              ? "bg-surface text-brand-600 shadow-sm"
              : "text-ink-soft hover:text-ink"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:block">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
/* ── Card used in the grid view ─────────────────────────────────────── */
function LeadGridCard({
  lead,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
}) {
  const stage =
    STAGE_STYLES[lead.status] || STAGE_STYLES.New;

  return (
    <div
      onClick={onOpen}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-surface p-5 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-pop)",
        selected
          ? "border-brand-400 ring-2 ring-brand-500/20"
          : "border-line"
      )}
    >
      {/* Accent */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          stage.bar
        )}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={lead.name}
            size="md"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {lead.name}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
              <Building2 className="h-3 w-3" />
              {lead.company || lead.email || "—"}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4 rounded border-line accent-brand-600"
          />

          <Dropdown
            trigger={
              <button className="rounded-xl p-2 text-ink-soft transition hover:bg-surface-muted">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => onEdit(lead)}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownItem>

            <DropdownItem
              danger
              onClick={() => onDelete(lead)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge
          className={stage.badge}
          dot={stage.dot}
        >
          {lead.status}
        </Badge>

        <Badge className={PRIORITY_STYLES[lead.priority]}>
          {lead.priority}
        </Badge>

        <span className="rounded-xl bg-surface-muted px-3 py-1 text-xs font-medium text-ink-soft">
          {lead.source}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-surface-muted/50 p-4">
        <p className="text-xs text-ink-soft">
          Deal Value
        </p>

        <div className="mt-1 flex items-end justify-between">
          <p className="font-display text-2xl font-bold text-ink">
            {currency(lead.value)}
          </p>

          <span className="text-xs text-ink-soft">
            {relative(lead.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Small UI Building Blocks
───────────────────────────────────────────────────────────────────── */

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="rounded-3xl border border-line bg-surface p-5 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-pop)">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            tint
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {label}
          </p>

          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function StageChip({
  label,
  count,
  dot,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-brand-500 bg-brand-600 text-white shadow-sm"
          : "border-line bg-surface text-ink-soft hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            active ? "bg-white" : dot
          )}
        />
      )}

      <span>{label}</span>

      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-semibold",
          active
            ? "bg-white/20 text-white"
            : "bg-surface-muted text-ink-soft"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SortTh({
  label,
  k,
  sort,
  onSort,
  align = "left",
}) {
  const active = sort.key === k;

  return (
    <th
      className={cn(
        "px-6 py-4 font-semibold",
        align === "right" && "text-right"
      )}
    >
      <button
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors duration-200",
          active
            ? "text-brand-600"
            : "text-ink-soft hover:text-ink"
        )}
      >
        <span>{label}</span>

        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ChevronDown className="h-4 w-4 opacity-30" />
        )}
      </button>
    </th>
  );
}

function Filter({
  value,
  onChange,
  all,
  options,
}) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border-line bg-surface lg:w-44"
    >
      <option value="">{all}</option>

      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </Select>
  );
}