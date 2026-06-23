import type { Application } from "@/types";
import { EyeIcon, ViewOffIcon } from "hugeicons-react";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-amber/10 text-amber",
  "phone-screen": "bg-blue-500/10 text-blue-400",
  interviewing: "bg-emerald-500/10 text-emerald-400",
  offer: "bg-gold/10 text-gold",
  rejected: "bg-red-500/10 text-red-400",
  ghosted: "bg-text-dim/10 text-text-dim",
};

const TYPE_COLORS: Record<string, string> = {
  remote: "bg-emerald-500/10 text-emerald-400",
  hybrid: "bg-amber/10 text-amber",
  "on-site": "bg-blue-500/10 text-blue-400",
  "part-time": "bg-purple-500/10 text-purple-400",
  internship: "bg-pink-500/10 text-pink-400",
  contract: "bg-orange-500/10 text-orange-400",
};

interface ApplicationsTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  page: number;
  pageSize: number;
  total: number;
}

export function ApplicationsTable({ applications, onEdit, onDelete, page, pageSize, total }: ApplicationsTableProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface text-text-muted">
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Company</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Role</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Location</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Type</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Status</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Spy</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Follow-ups</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Date</th>
              <th className="px-4 py-3 font-mono font-medium tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-text-muted">
                  No applications yet. Click "Log Application" to get started.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-b border-border/50 transition-colors hover:bg-surface-light">
                  <td className="px-4 py-3 font-medium text-text">{app.company}</td>
                  <td className="px-4 py-3 text-text-muted">{app.role}</td>
                  <td className="px-4 py-3 text-text-dim">{app.location ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-medium ${TYPE_COLORS[app.type] ?? "bg-surface-light text-text-muted"}`}>
                      {app.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-medium ${STATUS_COLORS[app.status] ?? ""}`}>
                      {app.status === "phone-screen" ? "Phone" : app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {app.spy_status === "opened" ? (
                      <EyeIcon className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <ViewOffIcon className="h-3.5 w-3.5 text-text-dim" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{app.follow_up_count}</td>
                  <td className="px-4 py-3 text-text-dim">{new Date(app.date_applied).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(app)}
                        className="cursor-pointer text-text-dim transition-colors hover:text-amber"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(app.id)}
                        className="cursor-pointer text-text-dim transition-colors hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
          <span>
            Showing {start} to {end} of {total} results
          </span>
        </div>
      )}
    </div>
  );
}
