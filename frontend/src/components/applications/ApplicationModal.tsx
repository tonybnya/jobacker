import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Application, ApplicationStatus, ApplicationType } from "@/types";

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "phone-screen", label: "Phone Screen" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "ghosted", label: "Ghosted" },
];

const TYPES: { value: ApplicationType; label: string }[] = [
  { value: "on-site", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Application>) => Promise<Application | null>;
  application: Partial<Application> | null;
}

export function ApplicationModal({ open, onClose, onSave, application }: ApplicationModalProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<ApplicationType>("on-site");
  const [status, setStatus] = useState<ApplicationStatus>("applied");
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split("T")[0]);
  const [jobUrl, setJobUrl] = useState("");
  const [spyStatus, setSpyStatus] = useState<"unseen" | "opened">("unseen");
  const [followUpCount, setFollowUpCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = application?.id !== undefined;

  useEffect(() => {
    if (open) {
      if (application) {
        setCompany(application.company ?? "");
        setRole(application.role ?? "");
        setLocation(application.location ?? "");
        setType(application.type ?? "on-site");
        setStatus(application.status ?? "applied");
        setDateApplied(application.date_applied?.split("T")[0] ?? new Date().toISOString().split("T")[0]);
        setJobUrl(application.job_url ?? "");
        setSpyStatus(application.spy_status ?? "unseen");
        setFollowUpCount(application.follow_up_count ?? 0);
        setNotes(application.notes ?? "");
        setJobDescription(application.job_description ?? "");
      } else {
        setCompany("");
        setRole("");
        setLocation("");
        setType("on-site");
        setStatus("applied");
        setDateApplied(new Date().toISOString().split("T")[0]);
        setJobUrl("");
        setSpyStatus("unseen");
        setFollowUpCount(0);
        setNotes("");
        setJobDescription("");
      }
      setError(null);
    }
  }, [open, application]);

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) {
      setError("Company and Role are required");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await onSave({
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || undefined,
      type,
      status,
      date_applied: dateApplied,
      job_url: jobUrl.trim() || undefined,
      spy_status: spyStatus,
      follow_up_count: followUpCount,
      notes: notes.trim() || undefined,
      job_description: jobDescription.trim() || undefined,
    });
    setSaving(false);
    if (result) {
      onClose();
    } else {
      setError("Failed to save application");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass max-h-[85vh] overflow-y-auto rounded-xl border border-border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-medium text-text">
                  {isEdit ? "Edit Application" : "Log Application"}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer text-xs text-text-muted transition-colors hover:text-text"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Frontend Engineer"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Remote / SF, CA"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Job URL</label>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ApplicationType)}
                      className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
                    >
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                      className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Date Applied</label>
                    <input
                      type="date"
                      value={dateApplied}
                      onChange={(e) => setDateApplied(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Spy Status</label>
                    <select
                      value={spyStatus}
                      onChange={(e) => setSpyStatus(e.target.value as "unseen" | "opened")}
                      className="w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
                    >
                      <option value="unseen">Unseen</option>
                      <option value="opened">Opened</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Follow-ups</label>
                    <input
                      type="number"
                      min={0}
                      value={followUpCount}
                      onChange={(e) => setFollowUpCount(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none focus:border-amber"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Recruiter name, salary range, source..."
                    className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-mono font-medium text-text-muted">
                    Job Description
                    <span className="ml-1 text-text-dim">(for scoring)</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    placeholder="Paste the job description here..."
                    className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-3 text-xs text-status-rejected">{error}</p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-lg border border-border px-4 py-2 text-xs text-text-muted transition-colors hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-5 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
