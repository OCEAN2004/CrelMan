/**
 * --------------------------------------------------------------------
 * CRELMAN • Tasks & Follow-ups
 * --------------------------------------------------------------------
 * Smart timeline for every follow-up in your sales pipeline.
 *
 * Features
 * • Timeline grouped by priority and due date
 * • Progress overview
 * • Quick status updates
 * • Premium timeline cards
 * • Complete CRUD
 * --------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPast, isToday } from "date-fns";

import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarCheck,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { StatCard } from "../components/common/StatCard";

import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Field,
  Badge,
  Dialog,
  Dropdown,
  DropdownItem,
  Tabs,
  Spinner,
} from "../components/ui";

import { tasksApi, leadsApi } from "../lib/services";

import {
  shortDate,
  dateInputValue,
} from "../lib/format";

import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";

import { cn } from "../lib/utils";

/* -------------------------------------------------------------------------- */
/* Priority Accent Colors                                                     */
/* -------------------------------------------------------------------------- */

const PRIORITY_BAR = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-400",
};

/* -------------------------------------------------------------------------- */
/* Timeline Groups                                                            */
/* -------------------------------------------------------------------------- */

const GROUPS = [
  {
    key: "overdue",
    label: "Overdue",
    labelClass: "text-rose-700",
    countClass: "bg-rose-50 text-rose-700",
  },
  {
    key: "today",
    label: "Due Today",
    labelClass: "text-amber-700",
    countClass: "bg-amber-50 text-amber-700",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    labelClass: "text-brand-700",
    countClass: "bg-brand-50 text-brand-700",
  },
  {
    key: "nodate",
    label: "No Due Date",
    labelClass: "text-ink-soft",
    countClass: "bg-surface-muted text-ink-soft",
  },
  {
    key: "completed",
    label: "Completed",
    labelClass: "text-emerald-700",
    countClass: "bg-emerald-50 text-emerald-700",
  },
];

/* -------------------------------------------------------------------------- */
/* Status Tabs                                                                */
/* -------------------------------------------------------------------------- */

const STATUS_TABS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") {
    return false;
  }

  const date = new Date(task.dueDate);

  return isPast(date) && !isToday(date);
}

function groupKey(task) {
  if (task.status === "Completed") return "completed";

  if (!task.dueDate) return "nodate";

  const date = new Date(task.dueDate);

  if (isToday(date)) return "today";

  if (isPast(date)) return "overdue";

  return "upcoming";
}

/* -------------------------------------------------------------------------- */
/* Add / Edit Dialog                                                          */
/* -------------------------------------------------------------------------- */

function TaskFormDialog({
  open,
  onClose,
  task,
  leads,
  onSaved,
}) {
  const isEdit = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();
  
// Reset form whenever the dialog opens or the target task changes.
useEffect(() => {
  if (open) {
    reset(
      task
        ? {
            title: task.title ?? "",
            description: task.description ?? "",
            dueDate: dateInputValue(task.dueDate),
            status: task.status ?? "Pending",
            priority: task.priority ?? "Medium",
            relatedLead: task.relatedLead?._id ?? "",
          }
        : {
            title: "",
            description: "",
            dueDate: "",
            status: "Pending",
            priority: "Medium",
            relatedLead: "",
          }
    );
  }
}, [open, task, reset]);

const onSubmit = async (values) => {
  const payload = {
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    dueDate: values.dueDate || undefined,
    status: values.status,
    priority: values.priority,
    relatedLead: values.relatedLead || null,
  };

  try {
    if (isEdit) {
      await tasksApi.update(task._id, payload);
      toast.success("Task updated");
    } else {
      await tasksApi.create(payload);
      toast.success("Task created");
    }

    onSaved();
    onClose();
  } catch (err) {
    toast.error(err?.message ?? "Something went wrong");
  }
};

return (
  <Dialog
    open={open}
    onClose={onClose}
    title={isEdit ? "Edit Task" : "Create New Task"}
    description={
      isEdit
        ? "Update the task details below."
        : "Schedule a follow-up task for your CRM workflow."
    }
  >
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-2 space-y-5"
    >
      {/* Task Title */}
      <Field
        label="Task Title"
        error={errors.title?.message}
      >
        <Input
          placeholder="Follow up with Acme Corporation"
          {...register("title", {
            required: "Title is required",
          })}
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <Textarea
          rows={4}
          placeholder="Add meeting notes, reminders or follow-up details..."
          {...register("description")}
        />
      </Field>

      {/* Due Date + Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Due Date">
          <Input
            type="date"
            {...register("dueDate")}
          />
        </Field>

        <Field label="Priority">
          <Select {...register("priority")}>
            {TASK_PRIORITIES.map((priority) => (
              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Status */}
      <Field label="Task Status">
        <Select {...register("status")}>
          {TASK_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </Select>
      </Field>

      {/* Related Lead */}
      <Field label="Related Lead">
        <Select {...register("relatedLead")}>
          <option value="">No linked lead</option>

          {leads.map((lead) => (
            <option
              key={lead._id}
              value={lead._id}
            >
              {lead.name}
              {lead.company ? ` — ${lead.company}` : ""}
            </option>
          ))}
        </Select>
      </Field>

      {/* Action */}
      <div className="flex gap-3 border-t border-line pt-4">
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
          {isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  </Dialog>
);
}

// ─── Single task row (module-level component) ─────────────────────────────────
function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === "Completed";
  const inProg = task.status === "In Progress";
  const overdue = isOverdue(task);
  const dueToday = task.dueDate ? isToday(new Date(task.dueDate)) : false;

  return (
    <div className="group relative flex items-start gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-surface-muted/60">
      {/* Priority accent bar */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
          PRIORITY_BAR[task.priority] ?? "bg-slate-300"
        )}
      />

      {/* Status toggle */}
      <button
        onClick={() => onToggle(task)}
        aria-label={done ? "Mark as pending" : "Mark as completed"}
        className={cn(
          "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors",
          done
            ? "text-brand-600 hover:text-brand-400"
            : inProg
            ? "text-sky-500 hover:text-brand-500"
            : "text-ink-soft hover:text-brand-500"
        )}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : inProg ? (
          <CircleDot className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <p
          className={cn(
            "text-sm font-semibold leading-6",
            done ? "text-ink-soft line-through" : "text-ink"
          )}
        >
          {task.title}
        </p>

        {/* Description */}
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-soft">
            {task.description}
          </p>
        )}

        {/* Meta chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Due date */}
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium",
                overdue
                  ? "bg-rose-50 text-rose-700"
                  : dueToday
                  ? "bg-amber-50 text-amber-700"
                  : "bg-surface-muted text-ink-soft"
              )}
            >
              {overdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}

              {overdue
                ? `Overdue • ${shortDate(task.dueDate)}`
                : dueToday
                ? `Today • ${shortDate(task.dueDate)}`
                : shortDate(task.dueDate)}
            </span>
          )}

          {/* Priority */}
          <Badge className={cn("text-xs", PRIORITY_STYLES[task.priority])}>
            {task.priority}
          </Badge>

          {/* Status */}
          <Badge className={cn("text-xs", TASK_STATUS_STYLES[task.status])}>
            {task.status}
          </Badge>

          {/* Lead */}
          {task.relatedLead && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              <Building2 className="h-3 w-3" />
              {task.relatedLead.name}
            </span>
          )}
        </div>
      </div>
      {/* Row actions */}
<div className="shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100">
  <Dropdown
    trigger={
      <button className="rounded-xl p-2 text-ink-soft transition-all hover:bg-surface-muted hover:text-ink">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    }
  >
    <DropdownItem onClick={() => onEdit(task)}>
      <Pencil className="h-4 w-4" />
      Edit
    </DropdownItem>

    <DropdownItem danger onClick={() => onDelete(task)}>
      <Trash2 className="h-4 w-4" />
      Delete
    </DropdownItem>
  </Dropdown>
</div>
</div>
);
}

// ─── Group section header (module-level) ──────────────────────────────────────
function GroupHeader({ label, count, labelClass, countClass }) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-surface-muted/40 px-5 py-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.08em]",
            labelClass
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            countClass
          )}
        >
          {count}
        </span>
      </div>
    </div>
  );
}

// ─── Completion progress bar card (module-level) ──────────────────────────────
function ProgressCard({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Task Progress
          </p>
          <p className="text-xs text-ink-soft">
            {completed} of {total} completed
          </p>
        </div>

        <span className="font-display text-lg font-bold text-brand-700">
          {pct}%
        </span>
      </div>

      {/* Track */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
        {/* Fill */}
        <div
          className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tasks() {
  // Raw data
  const [tasks, setTasks] = useState(null);
  const [leads, setLeads] = useState([]);

  // UI state
  const [tab, setTab] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Data loading ─────────────────────────────────────────────────────────
  const load = () => {
    setTasks(null);
    tasksApi.list().then((res) => setTasks(res.tasks)).catch(() => setTasks([]));
  };

  useEffect(() => {
    load();
    leadsApi.list().then((res) => setLeads(res.leads)).catch(() => {});
  }, []);

  // ── KPI counts ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!tasks) return { total: 0, pending: 0, overdue: 0, completed: 0 };

    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      overdue: tasks.filter(isOverdue).length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    };
  }, [tasks]);

  // ── Tab-filtered list ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!tasks) return [];
    if (tab === "all") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tasks, tab]);

  // ── Group the filtered tasks into timeline buckets ────────────────────────
  const groupedSections = useMemo(() => {
    const map = {};

    GROUPS.forEach((g) => (map[g.key] = []));

    filtered.forEach((t) => {
      map[groupKey(t)].push(t);
    });

    return GROUPS.filter((g) => map[g.key].length > 0).map((g) => ({
      ...g,
      tasks: map[g.key],
    }));
  }, [filtered]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };
  
  /** Toggle task: Completed ↔ Pending (In Progress tasks also toggle to Completed). */
const handleToggle = async (task) => {
  const next = task.status === "Completed" ? "Pending" : "Completed";

  try {
    await tasksApi.update(task._id, { status: next });
    load();
  } catch (err) {
    toast.error(err?.message ?? "Could not update task");
  }
};

const confirmDelete = async () => {
  setDeleting(true);

  try {
    await tasksApi.remove(toDelete._id);
    toast.success("Task deleted");
    setToDelete(null);
    load();
  } catch (err) {
    toast.error(err?.message ?? "Could not delete task");
  } finally {
    setDeleting(false);
  }
};

// ─────────────────────────────────────────────────────────────────────────
return (
  <div className="space-y-6">
    {/* Page header */}
    <PageHeader
      title="Follow-ups"
      subtitle="Track meetings, reminders and every important next step."
    >
      <Button onClick={openNew}>
        <Plus className="h-4 w-4" />
        Create Task
      </Button>
    </PageHeader>

    {/* KPI cards */}
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        label="Total Tasks"
        value={stats.total}
        icon={CalendarCheck}
      />

      <StatCard
        label="Pending"
        value={stats.pending}
        icon={Circle}
      />

      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
      />

      <StatCard
        label="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        accent
      />
    </div>

    {/* Progress */}
    {tasks !== null && (
      <ProgressCard
        completed={stats.completed}
        total={stats.total}
      />
    )}

    {/* Task Timeline */}
    <Card className="overflow-hidden rounded-3xl">
      {/* Tabs */}
      <div className="border-b border-line bg-surface-muted/20 px-5 py-4">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={STATUS_TABS}
        />
      </div>

      {/* Body */}
      {tasks === null ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No tasks found"
          description={
            tab === "all"
              ? "Create your first follow-up task to stay organized."
              : `There are no "${tab}" tasks right now.`
          }
          action={
            tab === "all" ? (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            ) : null
          }
        />
      ) : (
        <div>
          {groupedSections.map((group) => (
            <div key={group.key}>
              <GroupHeader
                label={group.label}
                count={group.tasks.length}
                labelClass={group.labelClass}
                countClass={group.countClass}
              />

              <div className="divide-y divide-line">
                {group.tasks.map((task) => (
                  <TaskRow
                    key={task._id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                    onDelete={setToDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>

    {/* Add / Edit dialog */}
    <TaskFormDialog
      open={formOpen}
      onClose={() => setFormOpen(false)}
      task={editing}
      leads={leads}
      onSaved={load}
    />

    {/* Delete confirmation */}
    <ConfirmDialog
      open={Boolean(toDelete)}
      onClose={() => setToDelete(null)}
      onConfirm={confirmDelete}
      loading={deleting}
      title="Delete Task?"
      description={`"${toDelete?.title}" will be permanently removed.`}
      confirmLabel="Delete Task"
    />
  </div>
);
}