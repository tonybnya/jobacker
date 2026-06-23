import type { Application, ApplicationStatus, ApplicationType } from "@/types";

const STATUSES: ApplicationStatus[] = [
  "applied", "phone-screen", "interviewing", "offer", "rejected", "ghosted",
];

const TYPES: ApplicationType[] = [
  "on-site", "remote", "hybrid", "part-time", "internship", "contract",
];

interface ApplicationInfoProps {
  application: Application;
  onSave: (data: Partial<Application>) => Promise<void>;
}

export function ApplicationInfo({ application, onSave }: ApplicationInfoProps) {
  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-4 text-xs font-medium text-text">Application Info</h3>
      <div className="space-y-3.5">
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Company</label>
          <p className="text-[12px] text-text">{application.company}</p>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Role</label>
          <p className="text-[12px] text-text">{application.role}</p>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Location</label>
          <p className="text-[12px] text-text-muted">{application.location ?? "-"}</p>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Type</label>
          <select
            defaultValue={application.type}
            className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Status</label>
          <select
            defaultValue={application.status}
            className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Date Applied</label>
          <p className="text-[12px] text-text-muted">{new Date(application.date_applied).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Spy Status</label>
          <p className="text-[12px] text-text-muted">{application.spy_status === "opened" ? "Opened" : "Unseen"}</p>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Follow-ups</label>
          <p className="text-[12px] text-text-muted">{application.follow_up_count}</p>
        </div>
        {application.notes && (
          <div>
            <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Notes</label>
            <p className="text-[11px] text-text-muted leading-relaxed">{application.notes}</p>
          </div>
        )}
        {application.job_url && (
          <div>
            <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Job URL</label>
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-amber underline"
            >
              View posting
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
