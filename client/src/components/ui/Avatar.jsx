import { cn, initials } from "../../lib/utils";

/* Premium CRELMAN avatar component.
   Displays profile image when available, otherwise beautifully styled initials. */

const palette = [
  "bg-linear-to-br from-violet-100 to-violet-200 text-violet-700 ring-1 ring-violet-200",
  "bg-linear-to-br from-purple-100 to-fuchsia-100 text-purple-700 ring-1 ring-purple-200",
  "bg-linear-to-br from-indigo-100 to-violet-100 text-indigo-700 ring-1 ring-indigo-200",
  "bg-linear-to-br from-pink-100 to-rose-100 text-rose-700 ring-1 ring-rose-200",
  "bg-linear-to-br from-sky-100 to-cyan-100 text-sky-700 ring-1 ring-sky-200",
  "bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700 ring-1 ring-emerald-200",
];

function colorFor(name = "") {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({
  name = "",
  src,
  size = "md",
  className,
}) {
  return (
    <div
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold shadow-sm transition-all duration-300",
        "select-none",
        sizes[size],
        !src && colorFor(name),
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <span className="font-semibold tracking-wide">
          {initials(name) || "?"}
        </span>
      )}
    </div>
  );
}