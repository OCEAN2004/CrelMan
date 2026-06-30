import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CalendarRange,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Target,
  Layers,
  PieChart as PieIcon,
  CalendarClock,
  Trophy,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { format, isPast } from "date-fns";

import { HeroCard } from "../components/dashboard/HeroCard";
import { AiInsightsCard } from "../components/ai/AiInsightsCard";
import {
  Card,
  SectionHeading,
  Badge,
  Tabs,
  Skeleton,
  Avatar,
} from "../components/ui";
import {
  analyticsApi,
  contactsApi,
  leadsApi,
  tasksApi,
} from "../lib/services";
import { currency, shortDate, timeOf } from "../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const SOURCE_COLORS = [
  "#8b5cf6",
  "#a855f7",
  "#7c3aed",
  "#6366f1",
  "#c4b5fd",
  "#ddd6fe",
];

export default function Dashboard() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    analyticsApi.overview()
      .then(setData)
      .catch(() => setData(false));

    contactsApi.list()
      .then((res) => setContacts(res.contacts || []))
      .catch(() => {});

    leadsApi.list()
      .then((res) => setLeads(res.leads || []))
      .catch(() => {});

    tasksApi.list()
      .then((res) => setTasks(res.tasks || []))
      .catch(() => {});
  }, []);

  if (data === null) return <DashboardSkeleton />;

  const stats = data?.stats || {};

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const rangeLabel = `${format(start, "dd MMM")} – ${format(
    today,
    "dd MMM, yyyy"
  )}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900">
            Welcome back,
            <span className="ml-2 text-violet-700">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening across your sales pipeline today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm sm:flex">
            <CalendarRange className="h-4 w-4 text-violet-600" />
            {rangeLabel}
          </div>

          <Link
            to="/leads"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition-all duration-300 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-3">
          <HeroCard value={stats.pipelineValue} />

          <Card className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-slate-500">
              Weekly Revenue
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h2 className="font-display text-3xl font-black tracking-tight text-slate-900">
                {currency(stats.revenueWon, { compact: true })}
              </h2>

              <Badge className="bg-violet-100 text-violet-700">
                <ArrowUpRight className="h-3 w-3" />
                12.8%
              </Badge>
            </div>
          </Card>

          <Card className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg">
            <SectionHeading
              icon={Target}
              title="Conversion Rate"
              subtitle="Sales performance"
            />

            <div className="mt-5 flex items-end gap-2">
              <h2 className="font-display text-4xl font-black text-slate-900">
                {stats.conversionRate ?? 0}
                <span className="ml-1 text-2xl font-semibold text-slate-400">
                  %
                </span>
              </h2>

              <Badge className="mb-1 bg-violet-100 text-violet-700">
                <ArrowUpRight className="h-3 w-3" />
                4.1%
              </Badge>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {stats.totalLeads ?? 0} Leads • {stats.openTasks ?? 0} Open Tasks
            </p>
          </Card>

          <UpcomingTasks tasks={tasks} />
          <TopContactsCard contacts={contacts} />
        </div>
        {/* ── Center column ─────────────────────────────── */}
        <div className="space-y-5 lg:col-span-6">
          <Card className="p-6">
            <SectionHeading
              icon={CreditCard}
              title="Pipeline Engagement"
              subtitle="New leads per month"
              action={
                <Tabs
                  value={range}
                  onChange={setRange}
                  tabs={[
                    { value: "monthly", label: "Monthly" },
                    { value: "annually", label: "Annually" },
                  ]}
                />
              }
            />
            <div className="mt-4">
              <EngagementChart trend={data?.trend || []} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading
              title="Lead Activity"
              subtitle="Recent lead movements"
              to="/leads"
            />
            <div className="mt-4">
              <ActivityTable leads={data?.recentLeads || []} />
            </div>
          </Card>

          <PipelineByStage pipeline={data?.pipeline || []} />
        </div>

        {/* ── Right column ──────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">
          {/* Revenue / balance card */}
          <Card className="p-6">
            <SectionHeading title="Revenue Goal" subtitle="Closed-won total" to="/pipeline" />
            <p className="mt-4 text-center text-sm text-ink-soft">Total Won</p>
            <p className="text-center font-display text-3xl font-bold tracking-tight text-ink">
              {currency(stats.revenueWon)}
            </p>
            <BalanceChart trend={data?.trend || []} />
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/leads"
                className="brand-gradient brand-gradient-hover inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white transition"
              >
                <Plus className="h-4 w-4" /> Add Lead
              </Link>
              <Link
                to="/tasks"
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-line text-sm font-medium text-ink transition hover:bg-surface-muted"
              >
                <CheckCircle2 className="h-4 w-4" /> Task
              </Link>
            </div>
          </Card>

          <AiInsightsCard />
          <LeadsBySource leads={leads} />
          <TopDeals leads={leads} />
        </div>
      </div>
    </div>
  );
}

/* ── Pipeline by stage (funnel-style breakdown) ─────────────────────── */
function PipelineByStage({ pipeline, className }) {
  const maxValue = Math.max(...pipeline.map((s) => s.value), 1);
  const totalValue = pipeline.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className={cn("p-6", className)}>
      <SectionHeading
        icon={Layers}
        title="Pipeline by Stage"
        subtitle="Deal value across each stage"
        to="/pipeline"
      />
      <div className="mt-5 space-y-4">
        {pipeline.map((s) => {
          const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
          const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
          return (
            <div key={s.stage}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
                  {s.stage}
                  <span className="text-ink-soft">· {s.count}</span>
                </span>
                <span className="font-semibold text-ink">
                  {currency(s.value, { compact: true })}
                  <span className="ml-1.5 text-xs font-normal text-ink-soft">{pct}%</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={cn("h-full rounded-full transition-all", style.bar)}
                  style={{ width: `${Math.max((s.value / maxValue) * 100, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
        {pipeline.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-soft">No pipeline data yet.</p>
        )}
      </div>
    </Card>
  );
}

/* ── Leads by source (donut chart) ──────────────────────────────────── */
function LeadsBySource({ leads }) {
  // Group leads by their source field.
  const grouped = leads.reduce((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const dataset = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <Card className="p-6">
      <SectionHeading icon={PieIcon} title="Leads by Source" subtitle="Where leads come from" />
      {dataset.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">No leads yet.</p>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataset}
                  dataKey="value"
                  innerRadius={44}
                  outerRadius={66}
                  paddingAngle={2}
                  stroke="none"
                >
                  {dataset.map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip unit=" leads" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-ink">{leads.length}</span>
              <span className="text-[11px] text-ink-soft">leads</span>
            </div>
          </div>
          <ul className="flex-1 space-y-1.5">
            {dataset.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-soft">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium text-ink">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )}

/* ───────────────── Upcoming Tasks ───────────────── */

function UpcomingTasks({ tasks }) {
  const upcoming = tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(a.dueDate) -
        new Date(b.dueDate)
      );
    })
    .slice(0, 4);

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg">
      <SectionHeading
        icon={CalendarClock}
        title="Upcoming Tasks"
        subtitle="Your next scheduled follow-ups"
        to="/tasks"
      />

      {upcoming.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          You're all caught up 🎉
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {upcoming.map((task) => {
            const overdue =
              task.dueDate &&
              isPast(
                new Date(task.dueDate)
              );

            return (
              <li
                key={task._id}
                className="flex items-start gap-4 rounded-2xl border border-violet-100 p-3 transition-all duration-300 hover:bg-violet-50"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                    overdue
                      ? "bg-rose-100 text-rose-600"
                      : "bg-violet-100 text-violet-700"
                  )}
                >
                  {overdue ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {task.title}
                  </p>

                  <p
                    className={cn(
                      "mt-1 text-xs",
                      overdue
                        ? "text-rose-600"
                        : "text-slate-500"
                    )}
                  >
                    {task.dueDate
                      ? shortDate(
                          task.dueDate
                        )
                      : "No Due Date"}

                    {task.relatedLead?.name &&
                      ` • ${task.relatedLead.name}`}
                  </p>
                </div>

                <Badge
                  className={
                    PRIORITY_STYLES[
                      task.priority
                    ]
                  }
                >
                  {task.priority}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────── Top Deals ───────────────── */

function TopDeals({ leads }) {
  const deals = [...leads]
    .filter(
      (lead) =>
        lead.status !== "Won" &&
        lead.status !== "Lost"
    )
    .sort(
      (a, b) =>
        (b.value || 0) -
        (a.value || 0)
    )
    .slice(0, 5);

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg">
      <SectionHeading
        icon={Trophy}
        title="Top Open Deals"
        subtitle="Highest-value opportunities"
        to="/leads"
      />

      {deals.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No active opportunities.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {deals.map((lead, index) => {
            const style =
              STAGE_STYLES[
                lead.status
              ] ||
              STAGE_STYLES.New;

            return (
              <li
                key={lead._id}
                className="flex items-center gap-4 rounded-2xl border border-violet-100 p-3 transition-all duration-300 hover:bg-violet-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {lead.name}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Building2 className="h-3 w-3" />
                    {lead.company ||
                      "No Company"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {currency(
                      lead.value,
                      {
                        compact: true,
                      }
                    )}
                  </p>

                  <span
                    className={cn(
                      "text-xs font-medium",
                      style.badge,
                      "bg-transparent px-0"
                    )}
                  >
                    {lead.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────── Engagement Chart ───────────────── */

function EngagementChart({ trend }) {
  const counts = trend.map(
    (item) => item.leads
  );

  const max = Math.max(
    ...counts,
    1
  );

  const maxIndex =
    counts.indexOf(max);

  const prev =
    maxIndex > 0
      ? counts[maxIndex - 1]
      : 0;

  const growth =
    prev > 0
      ? Math.round(
          ((max - prev) /
            prev) *
            1000
        ) / 10
      : 17.8;

  /* Highlight Bubble */

  const renderPeak = (
    props
  ) => {
    const {
      x,
      y,
      width,
      index,
    } = props;

    if (index !== maxIndex)
      return null;

    const cx =
      x + width / 2;

    return (
      <g>
        <circle
          cx={cx}
          cy={y}
          r={5}
          fill="#7C3AED"
          stroke="#fff"
          strokeWidth={2}
        />

        <rect
          x={cx - 28}
          y={y - 36}
          width={56}
          height={24}
          rx={12}
          fill="#7C3AED"
        />

        <text
          x={cx}
          y={y - 20}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#fff"
        >
          +{growth}%
        </text>
      </g>
    );
  };

 return (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={trend}
      barCategoryGap="28%"
      margin={{ top: 35, right: 5, left: 5 }}
    >
      <CartesianGrid
        vertical={false}
        stroke="#E9D5FF"
        strokeDasharray="4 4"
      />

      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{
          fill: "#64748B",
          fontSize: 12,
        }}
        dy={8}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        width={35}
        tick={{
          fill: "#64748B",
          fontSize: 12,
        }}
        tickFormatter={(v) =>
          v >= 1000 ? `${v / 1000}k` : v
        }
      />

      <Tooltip
        cursor={{
          fill: "#F5F3FF",
        }}
        content={
          <ChartTooltip unit=" leads" />
        }
      />

      <Bar
        dataKey="leads"
        radius={[16, 16, 16, 16]}
        maxBarSize={42}
        label={renderPeak}
      >
        {trend.map((_, i) => (
          <Cell
            key={i}
            fill={
              i === maxIndex
                ? "#7C3AED"
                : "#DDD6FE"
            }
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
}

function BalanceChart({ trend }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={130}
    >
      <AreaChart
        data={trend}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id="balance"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#8B5CF6"
              stopOpacity={0.35}
            />

            <stop
              offset="100%"
              stopColor="#8B5CF6"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <Tooltip
          content={
            <ChartTooltip prefix="₹" />
          }
        />

        <Area
          type="monotone"
          dataKey="won"
          stroke="#7C3AED"
          strokeWidth={3}
          fill="url(#balance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  prefix = "",
  unit = "",
}) {
  if (!active || !payload?.length)
    return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-slate-900">
        {prefix}
        {Number(
          payload[0].value
        ).toLocaleString()}
        {unit}
      </p>
    </div>
  );
}

/* ───────────────── Activity Table ───────────────── */

function ActivityTable({ leads }) {
  if (!leads.length)
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No recent activity available.
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-violet-100 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <th className="pb-4">
              Customer
            </th>

            <th className="pb-4">
              Date
            </th>

            <th className="hidden pb-4 sm:table-cell">
              Time
            </th>

            <th className="pb-4">
              Status
            </th>

            <th className="pb-4 text-right">
              Value
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => {
            const style =
              STAGE_STYLES[
                lead.status
              ] ||
              STAGE_STYLES.New;

            return (
              <tr
                key={lead.id}
                className="border-b border-violet-100 transition-all duration-300 hover:bg-violet-50"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={lead.name}
                      size="sm"
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        {lead.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {lead.company ||
                          "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 text-slate-500">
                  {shortDate(
                    lead.updatedAt
                  )}
                </td>

                <td className="hidden py-4 text-slate-500 sm:table-cell">
                  {timeOf(
                    lead.updatedAt
                  )}
                </td>

                <td className="py-4">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        style.dot
                      )}
                    />

                    {lead.status}
                  </span>
                </td>

                <td className="py-4 text-right font-bold text-slate-900">
                  {currency(
                    lead.value
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────── Top Contacts ───────────────── */

function TopContactsCard({
  contacts,
}) {
  const top = contacts.slice(0, 4);

  const overflow = Math.max(
    contacts.length -
      top.length,
    0
  );

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg">
      <SectionHeading
        title="Top Contacts"
        subtitle="Most valuable relationships"
        to="/contacts"
      />

      {contacts.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">
          No contacts available.
        </p>
      ) : (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex -space-x-3">
            {top.map((contact) => (
              <Avatar
                key={contact._id}
                name={contact.name}
                src={contact.avatar}
                size="md"
                className="ring-2 ring-white"
              />
            ))}

            {overflow > 0 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-sm font-bold text-white ring-2 ring-white">
                +{overflow}
              </div>
            )}
          </div>

          <Link
            to="/contacts"
            className="text-sm font-semibold text-violet-700 transition hover:text-violet-800 hover:underline"
          >
            View All
          </Link>
        </div>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-80" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>

        <div className="space-y-6 lg:col-span-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>

        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-60 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}