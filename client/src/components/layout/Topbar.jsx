import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../ui";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

//  CRELMAN Topbar 
export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100/60 bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 md:px-8">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-2xl border border-violet-100 bg-white p-2.5 text-slate-600 shadow-sm transition-all duration-300 hover:bg-violet-50 hover:text-violet-700 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-violet-100 via-purple-50 to-indigo-100 shadow-lg ring-1 ring-violet-200">
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
            <p className="-mt-0.5 text-xs font-medium text-violet-600">
              AI-powered CRM
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-6 hidden max-w-lg flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            placeholder="Search leads, contacts, tasks..."
            className="h-12 w-full rounded-2xl border border-violet-100 bg-linear-to-r from-white to-violet-50/40 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative rounded-2xl border border-violet-100 bg-white p-3 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />

            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-violet-50 hover:shadow-md">
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
      </div>
    </header>
  );
}