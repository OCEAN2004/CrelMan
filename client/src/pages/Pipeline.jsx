import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Building2,
  TrendingUp,
  Layers,
  Target,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  Spinner,
  Avatar,
  Badge,
  Card,
} from "../components/ui";
import {
  leadsApi,
  aiApi,
} from "../lib/services";
import { currency } from "../lib/format";
import {
  PIPELINE_STAGES,
  STAGE_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";

/* Convert lead list into pipeline columns */

const toBoard = (leads) => {
  const board = Object.fromEntries(
    PIPELINE_STAGES.map((stage) => [
      stage,
      [],
    ])
  );

  for (const lead of leads) {
    (board[lead.status] ||
      board.New).push(lead);
  }

  return board;
};

export default function Pipeline() {
  const [board, setBoard] =
    useState(null);

  const [activeId, setActiveId] =
    useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  useEffect(() => {
    leadsApi
      .list()
      .then((res) =>
        setBoard(
          toBoard(res.leads)
        )
      )
      .catch(() =>
        setBoard(toBoard([]))
      );
  }, []);

  if (!board) return <Spinner />;

  const findContainer = (id) => {
    if (id in board) return id;

    return PIPELINE_STAGES.find(
      (stage) =>
        board[stage].some(
          (lead) =>
            lead._id === id
        )
    );
  };

  const activeLead = activeId
    ? Object.values(board)
        .flat()
        .find(
          (lead) =>
            lead._id === activeId
        )
    : null;

  /* Drag Between Columns */

  const handleDragOver = ({
    active,
    over,
  }) => {
    if (!over) return;

    const from = findContainer(
      active.id
    );

    const to = findContainer(
      over.id
    );

    if (
      !from ||
      !to ||
      from === to
    )
      return;

    setBoard((prev) => {
      const fromItems = [
        ...prev[from],
      ];

      const toItems = [
        ...prev[to],
      ];

      const idx =
        fromItems.findIndex(
          (lead) =>
            lead._id === active.id
        );

      if (idx === -1)
        return prev;

      const [moved] =
        fromItems.splice(
          idx,
          1
        );

      moved.status = to;

      const overIdx =
        toItems.findIndex(
          (lead) =>
            lead._id === over.id
        );

      toItems.splice(
        overIdx === -1
          ? toItems.length
          : overIdx,
        0,
        moved
      );

      return {
        ...prev,
        [from]: fromItems,
        [to]: toItems,
      };
    });
  };

  /* Save Ordering */

  const handleDragEnd = ({
    active,
    over,
  }) => {
    setActiveId(null);

    if (!over) return;

    const container =
      findContainer(over.id);

    if (!container) return;

    setBoard((prev) => {
      const items = [
        ...prev[container],
      ];

      const oldIdx =
        items.findIndex(
          (lead) =>
            lead._id === active.id
        );

      const newIdx =
        items.findIndex(
          (lead) =>
            lead._id === over.id
        );

      const reordered =
        oldIdx !== -1 &&
        newIdx !== -1
          ? arrayMove(
              items,
              oldIdx,
              newIdx
            )
          : items;

      const next = {
        ...prev,
        [container]:
          reordered,
      };

      const updates = [];

      PIPELINE_STAGES.forEach(
        (stage) => {
          next[stage].forEach(
            (
              lead,
              order
            ) =>
              updates.push({
                id: lead._id,
                status: stage,
                order,
              })
          );
        }
      );

      leadsApi
        .reorder(updates)
        .catch(() =>
          toast.error(
            "Couldn't save pipeline"
          )
        );

      return next;
    });
  };

  /* Dashboard Statistics */

  const allLeads =
    Object.values(board).flat();

  const totalValue =
    allLeads.reduce(
      (sum, lead) =>
        sum +
        (lead.value || 0),
      0
    );

  const openDeals =
    allLeads.filter(
      (lead) =>
        lead.status !==
          "Won" &&
        lead.status !==
          "Lost"
    );

  const wonLeads =
    allLeads.filter(
      (lead) =>
        lead.status === "Won"
    );

  const wonValue =
    wonLeads.reduce(
      (sum, lead) =>
        sum +
        (lead.value || 0),
      0
    );

  const closedCount =
    wonLeads.length +
    (board.Lost?.length || 0);

  const winRate =
    closedCount > 0
      ? Math.round(
          (wonLeads.length /
            closedCount) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales Pipeline"
        subtitle={`${allLeads.length} Leads • ${currency(
          totalValue,
          {
            compact: true,
          }
        )} Pipeline Value`}
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatTile
          icon={DollarSign}
          tint="bg-linear-to-br from-violet-100 to-purple-100 text-violet-700"
          label="Pipeline Value"
          value={currency(
            totalValue,
            {
              compact: true,
            }
          )}
        />

        <StatTile
          icon={Layers}
          tint="bg-linear-to-br from-indigo-100 to-violet-100 text-indigo-700"
          label="Open Deals"
          value={openDeals.length}
        />

        <StatTile
          icon={Target}
          tint="bg-linear-to-br from-emerald-100 to-green-100 text-emerald-700"
          label="Won Value"
          value={currency(
            wonValue,
            {
              compact: true,
            }
          )}
        />

        <StatTile
          icon={TrendingUp}
          tint="bg-linear-to-br from-fuchsia-100 to-violet-100 text-fuchsia-700"
          label="Win Rate"
          value={`${winRate}%`}
        />
      </div>
           <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) =>
          setActiveId(active.id)
        }
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() =>
          setActiveId(null)
        }
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {PIPELINE_STAGES.map(
            (stage) => (
              <Column
                key={stage}
                stage={stage}
                leads={board[stage]}
              />
            )
          )}
        </div>

        <DragOverlay>
          {activeLead ? (
            <LeadCard
              lead={activeLead}
              overlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

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
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
            tint
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
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

/* ───────────────── Pipeline Column ───────────────── */

function Column({
  stage,
  leads,
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: stage,
  });

  const style =
    STAGE_STYLES[stage];

  const value = leads.reduce(
    (sum, lead) =>
      sum + (lead.value || 0),
    0
  );

  return (
    <div className="flex w-85 shrink-0 flex-col">
      <div
        className={cn(
          "mb-3 h-1.5 rounded-full",
          style.bar
        )}
      />

      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-3 w-3 rounded-full",
              style.dot
            )}
          />

          <h3 className="font-semibold text-slate-900">
            {stage}
          </h3>

          <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
            {leads.length}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {currency(value, {
            compact: true,
          })}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[70vh] flex-1 flex-col gap-4 rounded-3xl border border-violet-100 bg-violet-50/40 p-4 transition-all duration-300",
          isOver &&
            "border-violet-400 bg-violet-100/60 shadow-inner"
        )}
      >
        <SortableContext
          items={leads.map(
            (lead) => lead._id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          {leads.map((lead) => (
            <SortableCard
              key={lead._id}
              lead={lead}
            />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm font-medium text-slate-400">
              Drop Leads Here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── Sortable Wrapper ───────────────── */

function SortableCard({
  lead,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead._id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform:
          CSS.Transform.toString(
            transform
          ),
        transition,
      }}
      className={cn(
        isDragging &&
          "opacity-50"
      )}
    >
      <LeadCard
        lead={lead}
        dragHandle={{
          attributes,
          listeners,
        }}
      />
    </div>
  );
}

/* ───────────────── Lead Card ───────────────── */

function LeadCard({
  lead,
  dragHandle,
  overlay,
}) {
  const [suggesting, setSuggesting] =
    useState(false);

  const suggest = async (
    e
  ) => {
    e.stopPropagation();

    setSuggesting(true);

    try {
      const res =
        await aiApi.leadSummary({
          leadId: lead._id,
        });

      toast(
        `AI Suggestion • ${lead.name}`,
        {
          description: `${res.nextBestAction} (Priority: ${res.suggestedPriority})`,
          duration: 7000,
        }
      );
    } catch (err) {
      toast.error(
        err.message ||
          "AI unavailable"
      );
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div
      className={cn(
        "group rounded-3xl border border-violet-100 bg-white p-4 shadow-md transition-all duration-300",
        overlay
          ? "rotate-2 shadow-2xl"
          : "hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            name={lead.name}
            size="sm"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {lead.name}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Building2 className="h-3 w-3" />
              {lead.company ||
                "No Company"}
            </p>
          </div>
        </div>

        {dragHandle && (
          <button
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            className="cursor-grab rounded-lg p-1 text-slate-400 transition hover:bg-violet-100 hover:text-violet-700 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Deal Value */}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            Deal Value
          </p>

          <p className="mt-1 text-lg font-black text-slate-900">
            {currency(
              lead.value
            )}
          </p>
        </div>

        <Badge
          className={
            PRIORITY_STYLES[
              lead.priority
            ]
          }
        >
          {lead.priority}
        </Badge>
      </div>

      {/* AI Button */}

      {!overlay && (
        <button
          onClick={suggest}
          disabled={suggesting}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-70"
        >
          {suggesting
            ? "Thinking..."
            : "AI Suggest Next Step"}
        </button>
      )}
    </div>
  );
}