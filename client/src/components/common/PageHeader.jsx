/** Consistent premium page title + subtitle + optional right-aligned actions. */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">
          CRELMAN
        </p>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}