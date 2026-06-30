import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Contact2,
  KanbanSquare,
  StickyNote,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

/* Premium CRELMAN Icon Rail */

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/tasks", label: "Follow-ups", icon: CalendarCheck },
];

function RailLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
          isActive
            ? "bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-300/40 scale-105"
            : "bg-white text-slate-500 shadow-sm border border-violet-100 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md"
        )
      }
    >
      <Icon className="h-5 w-5" />

      {/* Premium Tooltip */}
      <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
        {label}
      </span>
    </NavLink>
  );
}

export function IconRail() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col items-center py-6">
      {/* Floating Rail */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-violet-100 bg-white/70 px-3 py-5 shadow-xl backdrop-blur-xl">
        {/* Main Navigation */}
        <nav className="flex flex-col items-center gap-3">
          {NAV.map((item) => (
            <RailLink key={item.to} {...item} />
          ))}
        </nav>

        {/* Divider */}
        <div className="my-5 h-px w-10 bg-linear-to-r from-transparent via-violet-300 to-transparent" />

        {/* Settings */}
        <RailLink
          to="/settings"
          label="Settings"
          icon={Settings}
        />

        {/* Logout */}
        <button
          onClick={logout}
          title="Log out"
          className="group relative mt-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md"
        >
          <LogOut className="h-5 w-5" />

          <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
}