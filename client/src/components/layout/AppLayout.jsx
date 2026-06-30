import { useState } from "react";
import { Outlet } from "react-router-dom";
import { IconRail } from "./IconRail";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

/**
 * Premium CRELMAN Application Layout
 * - Floating icon rail (desktop)
 * - Glassmorphism mobile drawer
 * - Floating premium top navigation
 * - Spacious responsive content area
 */
export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-linear-to-br from-violet-50 via-white to-purple-100">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-44 -top-44 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute right-30 top-1/3 h-105 w-105 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute bottom-40 left-1/3 h-95 w-95 rounded-full bg-indigo-300/15 blur-3xl" />
    </div>

      {/* Desktop Floating Icon Rail */}
      <div className="relative z-20 hidden shrink-0 px-4 py-6 lg:flex">
        <IconRail />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full animate-[slidein_.3s_ease]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="px-5 pt-5 md:px-8 md:pt-7">
          <TopNav onMenuClick={() => setMobileOpen(true)} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-5 pb-8 pt-6 md:px-8">
          <div className="mx-auto max-w-[1700px]">
            <div className="rounded-[30px] border border-white/50 bg-white/60 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl md:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}