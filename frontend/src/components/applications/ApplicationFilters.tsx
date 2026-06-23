import { useState, useRef, useEffect } from "react";
import { Search01Icon, ArrowDown01Icon } from "hugeicons-react";
import type { ApplicationsFilters } from "@/hooks/useApplications";

const STATUSES = ["all", "applied", "phone-screen", "interviewing", "offer", "rejected", "ghosted"] as const;
const TYPES = ["all", "on-site", "remote", "hybrid", "part-time", "internship", "contract"] as const;
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly { value: T; label: string }[] | readonly (string | T)[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text transition-colors hover:border-amber/40"
      >
        {current?.label ?? value}
        <ArrowDown01Icon className={`h-3 w-3 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[140px] rounded-lg border border-border bg-surface-solid py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value as T);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-light ${
                item.value === value ? "text-amber" : "text-text-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ApplicationFiltersProps {
  filters: ApplicationsFilters;
  onChange: (f: Partial<ApplicationsFilters>) => void;
}

export function ApplicationFilters({ filters, onChange }: ApplicationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search01Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Filter by company or role..."
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-xs text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber"
        />
      </div>

      <Dropdown value={filters.status} options={STATUSES} onChange={(v) => onChange({ status: v })} />
      <Dropdown value={filters.type} options={TYPES} onChange={(v) => onChange({ type: v })} />
      <Dropdown value={filters.sort} options={SORTS} onChange={(v) => onChange({ sort: v })} />
    </div>
  );
}
