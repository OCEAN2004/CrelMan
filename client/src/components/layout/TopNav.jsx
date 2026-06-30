import { NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, ChevronDown, User, LogOut } from "lucide-react";
import {
  Avatar,
  IconButton,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../ui";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.png";

/* Centered text links — a subset of the primary nav, rendered in a white pill
   exactly like the reference top bar. */
const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/contacts", label: "Contacts" },
  { to: "/tasks", label: "Follow-ups" },
];

export function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 rounded-2xl border border-violet-100/60 bg-white/80 px-5 py-3 shadow-lg shadow-violet-100/30 backdrop-blur-xl">
      {/* Brand */}
      <div className="flex items-center gap-3 pr-2">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-violet-100 to-purple-100 shadow-md ring-1 ring-violet-200">
          <img
            src={logo}
            alt="CRELMAN"
            className="h-8 w-8 object-contain"
          />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-lg font-bold tracking-wide text-slate-900">
            CRELMAN
          </h1>
          <p className="-mt-1 text-xs text-slate-500">AI-powered CRM</p>
        </div>
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-xl border border-violet-100 bg-white p-2 text-slate-600 shadow-sm transition-all duration-300 hover:bg-violet-50 hover:text-violet-700 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center Navigation */}
      <nav className="mx-auto hidden items-center gap-1 rounded-full border border-violet-100 bg-white/90 p-1.5 shadow-md backdrop-blur lg:flex">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2">
        <IconButton
          aria-label="Search"
          className="hidden rounded-xl border border-violet-100 bg-white shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-violet-50 sm:inline-flex"
        >
          <Search className="h-4.5 w-4.5" />
        </IconButton>

        <IconButton
          aria-label="Notifications"
          className="relative rounded-xl border border-violet-100 bg-white shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-violet-50"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white" />
        </IconButton>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-violet-100 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-violet-50">
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-300" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>

          <DropdownSeparator />

          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-4 w-4" />
            Profile & Settings
          </DropdownItem>

          <DropdownItem danger onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}