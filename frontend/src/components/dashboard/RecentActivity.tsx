import type { ActivityItem } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  score: "bg-emerald-500",
  application: "bg-amber",
  cover_letter: "bg-blue-500",
  tailored_resume: "bg-purple-500",
};

interface RecentActivityProps {
  items: ActivityItem[];
  loading: boolean;
}

export function RecentActivity({ items, loading }: RecentActivityProps) {
  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-4 text-xs font-medium text-text">Recent Activity</h3>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[11px] text-text-muted">
          No activity yet. Start by logging your first application.
        </p>
      ) : (
        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-3 ${i < items.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_COLORS[item.type] ?? "bg-text-dim"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-text truncate">{item.description}</p>
                <p className="text-[10px] text-text-dim">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
