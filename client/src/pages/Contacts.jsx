import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  Star,
  Contact2,
  Tag,
  X,
  LayoutGrid,
  Table2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import {
  Button,
  Card,
  Input,
  Textarea,
  Field,
  Badge,
  Avatar,
  Dialog,
  Drawer,
  Dropdown,
  DropdownItem,
  Spinner,
} from "../components/ui";
import { contactsApi } from "../lib/services";
import { relative, shortDate } from "../lib/format";
import { cn } from "../lib/utils";

/* ────────────────────────────────────────────────────────────────
   Smooth FLIP animation for card & table reordering.
   Keeps starred contacts moving naturally without remounting.
   ──────────────────────────────────────────────────────────────── */
function useFlip(dep) {
  const containerRef = useRef(null);
  const prevRects = useRef(new Map());

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const nodes = Array.from(el.querySelectorAll("[data-flip-id]"));

    const nextRects = new Map();
    nodes.forEach((node) => {
      nextRects.set(node.dataset.flipId, node.getBoundingClientRect());
    });

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion) {
      nodes.forEach((node) => {
        const previous = prevRects.current.get(node.dataset.flipId);
        const current = nextRects.get(node.dataset.flipId);

        if (!previous) return;

        const dx = previous.left - current.left;
        const dy = previous.top - current.top;

        if (dx || dy) {
          node.animate(
            [
              {
                transform: `translate(${dx}px, ${dy}px)`,
              },
              {
                transform: "translate(0px, 0px)",
              },
            ],
            {
              duration: 350,
              easing: "cubic-bezier(.22,1,.36,1)",
            }
          );
        }
      });
    }

    prevRects.current = nextRects;
  }, [dep]);

  return containerRef;
}

/* ────────────────────────────────────────────────────────────────
   Contacts
   Premium CRELMAN contact management with
   grid/table layouts, favorites, tags,
   quick search, drawer preview and CRUD.
   ──────────────────────────────────────────────────────────────── */

export default function Contacts() {
  // null = loading
  // [] = empty
  // [...] = loaded

  const [contacts, setContacts] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    tag: "",
  });

  const [view, setView] = useState("grid");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // { contactId : boolean }
  const [favLoading, setFavLoading] = useState({});

  /* Load Contacts */

  const load = () => {
    setContacts(null);

    contactsApi
      .list()
      .then((res) => setContacts(res.contacts))
      .catch(() => setContacts([]));
  };

  useEffect(load, []);

    /* ────────────────────────────────────────────────────────────────
     Derived Data
     ──────────────────────────────────────────────────────────────── */

  // Unique tags across every contact
  const allTags = useMemo(() => {
    if (!contacts) return [];

    const set = new Set();

    contacts.forEach((contact) =>
      (contact.tags || []).forEach((tag) => set.add(tag))
    );

    return Array.from(set).sort();
  }, [contacts]);

  // Contact count for each tag
  const tagCounts = useMemo(() => {
    const counts = {
      All: contacts?.length || 0,
    };

    allTags.forEach((tag) => {
      counts[tag] = (contacts || []).filter((contact) =>
        (contact.tags || []).includes(tag)
      ).length;
    });

    return counts;
  }, [contacts, allTags]);

  // Dashboard statistics
  const kpis = useMemo(() => {
    const list = contacts || [];

    const favorites = list.filter((contact) => contact.favorite).length;

    const uniqueCompanies = new Set(
      list.map((contact) => contact.company).filter(Boolean)
    ).size;

    const tagged = list.filter(
      (contact) => (contact.tags || []).length > 0
    ).length;

    return {
      total: list.length,
      favorites,
      companies: uniqueCompanies,
      tagged,
    };
  }, [contacts]);

  // Search + tag filtering
  const filtered = useMemo(() => {
    if (!contacts) return [];

    return contacts.filter((contact) => {
      if (
        filters.tag &&
        !(contact.tags || []).includes(filters.tag)
      )
        return false;

      if (filters.search) {
        const query = filters.search.toLowerCase();

        return (
          contact.name?.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.company?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [contacts, filters]);

  // Favorites always stay at the top
  const ordered = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)
      ),
    [filtered]
  );

  const filtersActive =
    filters.search || filters.tag;

  // Smooth reorder animation
  const gridRef = useFlip(ordered);
  const tableRef = useFlip(ordered);

  /* ────────────────────────────────────────────────────────────────
     Actions
     ──────────────────────────────────────────────────────────────── */

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (contact) => {
    setSelected(null);
    setEditing(contact);
    setFormOpen(true);
  };

  const handleSaved = () => load();

  // Optimistic favorite toggle
  const toggleFavorite = async (e, contact) => {
    e.stopPropagation();

    if (favLoading[contact._id]) return;

    const next = !contact.favorite;

    setFavLoading((prev) => ({
      ...prev,
      [contact._id]: true,
    }));

    setContacts((prev) =>
      (prev || []).map((c) =>
        c._id === contact._id
          ? { ...c, favorite: next }
          : c
      )
    );

    try {
      await contactsApi.update(contact._id, {
        favorite: next,
      });
    } catch (err) {
      setContacts((prev) =>
        (prev || []).map((c) =>
          c._id === contact._id
            ? { ...c, favorite: !next }
            : c
        )
      );

      toast.error(
        err?.message || "Could not update favorite"
      );
    } finally {
      setFavLoading((prev) => ({
        ...prev,
        [contact._id]: false,
      }));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await contactsApi.remove(toDelete._id);

      toast.success("Contact removed");

      setToDelete(null);
      setSelected(null);

      load();
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contacts"
        subtitle="Manage clients, business partners and professional relationships."
      >
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </PageHeader>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatTile
          icon={Users}
          tint="bg-linear-to-br from-violet-100 to-violet-200 text-violet-700"
          label="Contacts"
          value={kpis.total}
        />

        <StatTile
          icon={Star}
          tint="bg-linear-to-br from-amber-100 to-yellow-100 text-amber-600"
          label="Favorites"
          value={kpis.favorites}
        />

        <StatTile
          icon={Building2}
          tint="bg-linear-to-br from-indigo-100 to-violet-100 text-indigo-700"
          label="Companies"
          value={kpis.companies}
        />

        <StatTile
          icon={Tag}
          tint="bg-linear-to-br from-purple-100 to-fuchsia-100 text-purple-700"
          label="Tagged"
          value={kpis.tagged}
        />
      </div>

      {/* Search & Filters */}

      <Card className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-lg backdrop-blur-sm ">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 " />

          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
            placeholder="Search by customer, company or email..."
            className="pl-11"
          />
        </div>

               {/* Filter Chips */}

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <TagChip
            label="All"
            count={tagCounts.All}
            active={!filters.tag}
            onClick={() =>
              setFilters({
                ...filters,
                tag: "",
              })
            }
          />

          {allTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              count={tagCounts[tag] || 0}
              active={filters.tag === tag}
              onClick={() =>
                setFilters({
                  ...filters,
                  tag:
                    filters.tag === tag
                      ? ""
                      : tag,
                })
              }
            />
          ))}

          <div className="ml-auto flex flex-wrap items-center gap-3">
            {filtersActive && (
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    tag: "",
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-all duration-300 hover:bg-violet-100"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-sm text-slate-600">
              <span className="font-bold text-violet-700">
                {filtered.length}
              </span>{" "}
              of {contacts?.length ?? 0} Contacts
            </div>

            <ViewToggle
              view={view}
              onChange={setView}
            />
          </div>
        </div>
      </Card>

      {/* Results */}

      {contacts === null ? (
        <div className="flex items-center justify-center py-24">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Contact2}
          title={
            filtersActive
              ? "No Contacts Found"
              : "No Contacts Yet"
          }
          description={
            filtersActive
              ? "Try another keyword or remove the selected filters."
              : "Start building your customer network by adding your first contact."
          }
          action={
            !filtersActive ? (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            ) : null
          }
        />
      ) : view === "grid" ? (
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {ordered.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              flipId={contact._id}
              favLoading={!!favLoading[contact._id]}
              onToggleFavorite={toggleFavorite}
              onOpen={() => setSelected(contact)}
              onEdit={() => openEdit(contact)}
              onDelete={() => setToDelete(contact)}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-linear-to-r from-violet-50 via-purple-50 to-indigo-50">
                <tr className="border-b border-violet-100 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Designation
                  </th>

                  <th className="px-6 py-4">
                    Tags
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="w-24 px-6 py-4" />
                </tr>
              </thead>

              <tbody
                ref={tableRef}
                className="divide-y divide-violet-100"
              >
                {ordered.map((contact) => (
                  <ContactTableRow
                    key={contact._id}
                    contact={contact}
                    flipId={contact._id}
                    favLoading={!!favLoading[contact._id]}
                    onToggleFavorite={toggleFavorite}
                    onOpen={() =>
                      setSelected(contact)
                    }
                    onEdit={() =>
                      openEdit(contact)
                    }
                    onDelete={() =>
                      setToDelete(contact)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Contact Details */}

      <ContactDrawer
        open={Boolean(selected)}
        contact={selected}
        onClose={() => setSelected(null)}
        onEdit={() => openEdit(selected)}
        onDelete={() => setToDelete(selected)}
      />

      {/* Create / Edit */}

      <ContactFormDialog
        open={formOpen}
        contact={editing}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Contact?"
        description={`"${toDelete?.name}" will be permanently removed from CRELMAN. This action cannot be undone.`}
        confirmLabel="Delete Contact"
      />
    </div>
  );
}
/* ────────────────────────────────────────────────────────────────
   Statistics Card
   ──────────────────────────────────────────────────────────────── */

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-lg shadow-violet-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
      </div>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────
   Filter Chip
   ──────────────────────────────────────────────────────────────── */

function TagChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
        active
          ? "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-300/30"
          : "border border-violet-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
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

/* ────────────────────────────────────────────────────────────────
   Grid / Table Toggle
   ──────────────────────────────────────────────────────────────── */

function ViewToggle({ view, onChange }) {
  const options = [
    {
      value: "grid",
      icon: LayoutGrid,
      label: "Card View",
    },
    {
      value: "table",
      icon: Table2,
      label: "Table View",
    },
  ];

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-violet-100 bg-white p-1 shadow-sm">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          aria-label={label}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
            view === value
              ? "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Contact Card
   ──────────────────────────────────────────────────────────────── */

function ContactCard({
  contact,
  flipId,
  favLoading,
  onToggleFavorite,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <div
      data-flip-id={flipId}
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
    >
      {/* Decorative Glow */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-linear-to-br from-violet-100/50 to-transparent blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* Favorite */}
      <button
        onClick={(e) => onToggleFavorite(e, contact)}
        disabled={favLoading}
        aria-label={
          contact.favorite
            ? "Remove Favorite"
            : "Mark Favorite"
        }
        className="absolute right-5 top-5 z-10 rounded-xl p-2 transition-all duration-300 hover:bg-violet-50"
      >
        <Star
          className={cn(
            "h-5 w-5 transition-all",
            contact.favorite
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 group-hover:text-violet-500"
          )}
        />
      </button>


            {/* Actions */}
      <div
        className="absolute right-5 top-14 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown
          trigger={
            <button className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownItem>

          <DropdownItem danger onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownItem>
        </Dropdown>
      </div>

      {/* Contact */}
      <div className="relative flex items-start gap-4 pr-10">
        <Avatar
          name={contact.name}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-tight text-slate-900">
            {contact.name}
          </h3>

          {(contact.title || contact.company) && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {[contact.title, contact.company]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}

      {contact.tags?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {contact.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>
              {tag}
            </Badge>
          ))}

          {contact.tags.length > 3 && (
            <Badge className="bg-violet-100 text-violet-700">
              +{contact.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Contact Information */}

      <div className="mt-6 space-y-3 border-t border-violet-100 pt-5">
        {contact.email && (
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-violet-500" />

            <span className="truncate">
              {contact.email}
            </span>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-violet-500" />

            <span>{contact.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Contact Table Row
   ──────────────────────────────────────────────────────────────── */

function ContactTableRow({
  contact,
  flipId,
  favLoading,
  onToggleFavorite,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <tr
      data-flip-id={flipId}
      onClick={onOpen}
      className="group cursor-pointer border-b border-violet-100 transition-all duration-300 hover:bg-violet-50/50"
    >
      {/* Contact */}

      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar
            name={contact.name}
            size="sm"
          />

          <div>
            <p className="font-semibold text-slate-900">
              {contact.name}
            </p>

            <p className="text-xs text-slate-500">
              {contact.company ||
                contact.email ||
                "—"}
            </p>
          </div>
        </div>
      </td>

      {/* Designation */}

      <td className="px-6 py-4 text-sm text-slate-600">
        {contact.title || "—"}
      </td>

      {/* Tags */}

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {(contact.tags || [])
            .slice(0, 2)
            .map((tag) => (
              <Badge key={tag}>
                {tag}
              </Badge>
            ))}

          {(contact.tags || []).length >
            2 && (
            <Badge className="bg-violet-100 text-violet-700">
              +
              {contact.tags.length - 2}
            </Badge>
          )}

          {!contact.tags?.length && (
            <span className="text-xs text-slate-400">
              —
            </span>
          )}
        </div>
      </td>

      {/* Email */}

      <td className="px-6 py-4 text-sm text-slate-600">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="transition hover:text-violet-700 hover:underline"
          >
            {contact.email}
          </a>
        ) : (
          "—"
        )}
      </td>

      {/* Phone */}

      <td className="px-6 py-4 text-sm text-slate-600">
        {contact.phone || "—"}
      </td>

      {/* Actions */}

      <td
        className="px-6 py-4"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) =>
              onToggleFavorite(e, contact)
            }
            disabled={favLoading}
            aria-label={
              contact.favorite
                ? "Remove Favorite"
                : "Mark Favorite"
            }
            className="rounded-xl p-2 transition-all duration-300 hover:bg-violet-50"
          >
            <Star
              className={cn(
                "h-4 w-4",
                contact.favorite
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 hover:text-violet-600"
              )}
            />
          </button>

          <Dropdown
            trigger={
              <button className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownItem>

            <DropdownItem
              danger
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
}

/* ────────────────────────────────────────────────────────────────
   Contact Drawer
   Premium CRELMAN contact preview panel
   ──────────────────────────────────────────────────────────────── */

function ContactDrawer({
  open,
  contact,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!contact) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Contact Details"
    >
      <div className="space-y-7">
        {/* Profile Header */}

        <div className="rounded-3xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-purple-50 p-6">
          <div className="flex items-center gap-4">
            <Avatar
              name={contact.name}
              size="lg"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-2xl font-black tracking-tight text-slate-900">
                  {contact.name}
                </h2>

                {contact.favorite && (
                  <Star className="h-5 w-5 shrink-0 fill-amber-400 text-amber-400" />
                )}
              </div>

              {(contact.title ||
                contact.company) && (
                <p className="mt-1 truncate text-sm text-slate-500">
                  {[contact.title, contact.company]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}

              {contact.favorite && (
                <Badge className="mt-3">
                  Favorite Contact
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Information */}

        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
          {contact.email && (
            <DrawerRow
              icon={
                <Mail className="h-4 w-4 text-violet-600" />
              }
              label="Email"
            >
              <a
                href={`mailto:${contact.email}`}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="font-medium text-violet-700 transition hover:text-violet-800 hover:underline"
              >
                {contact.email}
              </a>
            </DrawerRow>
          )}

          {contact.phone && (
            <DrawerRow
              icon={
                <Phone className="h-4 w-4 text-violet-600" />
              }
              label="Phone"
            >
              <a
                href={`tel:${contact.phone}`}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="font-medium text-violet-700 transition hover:text-violet-800 hover:underline"
              >
                {contact.phone}
              </a>
            </DrawerRow>
          )}

          {contact.company && (
            <DrawerRow
              icon={
                <Building2 className="h-4 w-4 text-violet-600" />
              }
              label="Company"
            >
              <span className="font-medium text-slate-700">
                {contact.company}
              </span>
            </DrawerRow>
          )}
        </div>

        {/* Tags */}

        {contact.tags?.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              <Tag className="h-4 w-4" />
              Tags
            </div>

            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

         {/* Notes */}

        {contact.notes && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              <Pencil className="h-4 w-4" />
              Notes
            </div>

            <div className="rounded-3xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-purple-50 p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {contact.notes}
              </p>
            </div>
          </div>
        )}

        {/* Created */}

        <div className="rounded-2xl bg-violet-50 px-4 py-3 text-xs text-slate-500">
          Added on{" "}
          <span className="font-semibold text-slate-700">
            {shortDate(contact.createdAt)}
          </span>{" "}
          <span className="text-violet-600">
            ({relative(contact.createdAt)})
          </span>
        </div>

        {/* Footer Actions */}

        <div className="flex gap-3 border-t border-violet-100 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
            Edit Contact
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

/* ────────────────────────────────────────────────────────────────
   Drawer Information Row
   ──────────────────────────────────────────────────────────────── */

function DrawerRow({ icon, label, children }) {
  return (
    <div className="flex items-center gap-4 border-b border-violet-100 px-5 py-4 last:border-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        {icon}
      </div>

      <div className="w-20 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
      </div>

      <div className="min-w-0 flex-1 text-sm text-slate-700">
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Contact Form Dialog
   ──────────────────────────────────────────────────────────────── */

function ContactFormDialog({
  open,
  contact,
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(contact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        contact
          ? {
              name: contact.name || "",
              title: contact.title || "",
              company: contact.company || "",
              email: contact.email || "",
              phone: contact.phone || "",
              tags: (contact.tags || []).join(", "),
              notes: contact.notes || "",
              favorite: contact.favorite || false,
            }
          : {
              name: "",
              title: "",
              company: "",
              email: "",
              phone: "",
              tags: "",
              notes: "",
              favorite: false,
            }
      );
    }
  }, [open, contact, reset]);

  const onSubmit = async (values) => {
    const tags = values.tags
      ? values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...values,
      tags,
    };

    try {
      if (isEdit) {
        await contactsApi.update(
          contact._id,
          payload
        );

        toast.success("Contact updated");
      } else {
        await contactsApi.create(payload);

        toast.success("Contact added");
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        err?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        isEdit
          ? "Edit Contact"
          : "New Contact"
      }
      description={
        isEdit
          ? "Update customer information."
          : "Add a new customer, client or business contact."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-5"
      >
        <Field
          label="Full Name"
          error={errors.name?.message}
        >
          <Input
            {...register("name", {
              required:
                "Name is required",
            })}
            placeholder="Rahul Sharma"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Designation">
            <Input
              {...register("title")}
              placeholder="Sales Manager"
            />
          </Field>

          <Field label="Company">
            <Input
              {...register("company")}
              placeholder="ABC Technologies Pvt. Ltd."
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Business Email">
            <Input
              {...register("email")}
              type="email"
              placeholder="rahul@company.in"
            />
          </Field>

          <Field label="Phone Number">
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+91 98765 43210"
            />
          </Field>
        </div>

        <Field label="Tags">
          <div className="relative">
            <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />

            <Input
              {...register("tags")}
              className="pl-11"
              placeholder="Client, Retail, VIP"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Separate multiple tags with commas.
          </p>
        </Field>

        <Field label="Notes">
          <Textarea
            {...register("notes")}
            rows={4}
            placeholder="Meeting history, requirements, follow-up reminders..."
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 transition-all duration-300 hover:bg-violet-100">
          <input
            type="checkbox"
            {...register("favorite")}
            className="h-4 w-4 accent-violet-600"
          />

          <div>
            <p className="font-semibold text-slate-700">
              Mark as Favorite
            </p>

            <p className="text-xs text-slate-500">
              Favorites appear at the top of your contacts.
            </p>
          </div>

          <Star className="ml-auto h-5 w-5 text-amber-400" />
        </label>

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
            {isEdit
              ? "Save Changes"
              : "Add Contact"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
