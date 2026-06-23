import { useState } from "react";
import { motion } from "framer-motion";
import type { Application, ApplicationStatus } from "@/types";

const COLUMNS: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "phone-screen", label: "Phone" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
  { key: "ghosted", label: "Ghosted" },
];

const COLUMN_COLORS: Record<string, string> = {
  applied: "border-l-amber",
  "phone-screen": "border-l-blue-500",
  interviewing: "border-l-emerald-500",
  offer: "border-l-gold",
  rejected: "border-l-red-500",
  ghosted: "border-l-text-dim",
};

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-amber/10 text-amber",
  "phone-screen": "bg-blue-500/10 text-blue-400",
  interviewing: "bg-emerald-500/10 text-emerald-400",
  offer: "bg-gold/10 text-gold",
  rejected: "bg-red-500/10 text-red-400",
  ghosted: "bg-text-dim/10 text-text-dim",
};

interface PipelineViewProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
}

export function PipelineView({ applications, onStatusChange, onEdit }: PipelineViewProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  const columns = COLUMNS.map((col) => ({
    ...col,
    items: applications.filter((a) => a.status === col.key),
  }));

  return (
    <div className="grid grid-cols-6 gap-3">
      {columns.map((col) => (
        <div
          key={col.key}
          className={`glass rounded-xl border-l-2 ${COLUMN_COLORS[col.key]} p-3`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-mono font-medium tracking-wider text-text-muted">
              {col.label}
            </span>
            <span className="text-[10px] font-mono text-text-dim">{col.items.length}</span>
          </div>

          <div className="flex flex-col gap-2">
            {col.items.length === 0 && !dragId ? (
              <p className="py-4 text-center text-[10px] text-text-dim">-</p>
            ) : (
              col.items.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  layoutId={app.id}
                  draggable
                  onDragStart={() => setDragId(app.id)}
                  onDragEnd={() => setDragId(null)}
                  onClick={() => onEdit(app)}
                  className="cursor-grab rounded-lg border border-border bg-surface px-3 py-2.5 text-xs transition-colors hover:border-amber/30 active:cursor-grabbing"
                >
                  <p className="mb-0.5 font-medium text-text">{app.role}</p>
                  <p className="mb-2 text-[10px] text-text-muted">{app.company}</p>
                  <div className="flex items-center justify-between">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-medium ${STATUS_COLORS[app.status] ?? ""}`}>
                      {app.type}
                    </span>
                    <span className="text-[9px] font-mono text-text-dim">
                      {new Date(app.date_applied).toLocaleDateString()}
                    </span>
                  </div>
                  {app.follow_up_count > 0 && (
                    <p className="mt-1.5 text-[9px] text-text-dim">
                      {app.follow_up_count} follow-up{app.follow_up_count > 1 ? "s" : ""}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
