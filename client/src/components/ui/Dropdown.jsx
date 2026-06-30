import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/**
 * Premium CRELMAN Dropdown
 * Redesigned UI while preserving all functionality.
 */
export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);

    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-3 min-w-56 overflow-hidden rounded-3xl border border-violet-100 bg-white/95 p-2 shadow-[0_20px_60px_rgba(124,58,237,0.12)] backdrop-blur-xl animate-fade-up",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  className,
  danger,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700",
        danger &&
          "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownLabel({ children }) {
  return (
    <div className="px-4 py-2">
      <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
        Signed in as
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-700">
        {children}
      </p>
    </div>
  );
}

export function DropdownSeparator() {
  return (
    <div className="my-2 h-px bg-violet-100" />
  );
}