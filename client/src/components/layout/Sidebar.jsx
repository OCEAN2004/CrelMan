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
import logo from "../../assets/logo.png";

/* Primary navigation */
const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/tasks", label: "Follow-ups", icon: CalendarCheck },
];

export function Sidebar({ onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-violet-100 bg-linear-to-b from-white via-violet-50/40 to-white shadow-xl">
      {/* Brand */}
      <div className="border-b border-violet-100 px-6 py-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-violet-100 via-purple-50 to-indigo-100 shadow-md ring-1 ring-violet-200">
            <img
              src={logo}
              alt="CRELMAN"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-slate-900">
              CRELMAN
            </h1>
            <p className="text-xs font-medium text-violet-600">
              AI-powered CRM
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                  : "text-slate-600 hover:bg-white hover:text-violet-700 hover:shadow-md"
              )
            }
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-105">
              <Icon className="h-5 w-5" />
            </div>

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-violet-100 p-4">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "mb-2 flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
              isActive
                ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                : "text-slate-600 hover:bg-white hover:text-violet-700 hover:shadow-md"
            )
          }
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <Settings className="h-5 w-5" />
          </div>

          <span>Settings</span>
        </NavLink>

        <button
          onClick={logout}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            <LogOut className="h-5 w-5" />
          </div>

          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}