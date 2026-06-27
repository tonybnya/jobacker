import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiMagicIcon, Award01Icon } from "hugeicons-react";
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

interface PreviewScore {
  overall_score: number;
  keyword_score: number;
  ats_score: number;
  impact_score: number;
  readability_score: number;
  skills_match: Array<{ skill: string; matchPercent: number }>;
  pros: string[];
  cons: string[];
  missing_keywords: Array<{ keyword: string; suggestion: string }>;
  improvements: Array<{ tag: "ADD" | "REPHRASE" | "FORMAT"; text: string }>;
  sample_resume_text: string;
}

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

  const [scoring, setScoring] = useState(false);
  const [scored, setScored] = useState(false);
  const [previewScore, setPreviewScore] = useState<PreviewScore | null>(null);
  const [previewCoverLetter, setPreviewCoverLetter] = useState<string | null>(null);

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
      setScored(false);
      setPreviewScore(null);
      setPreviewCoverLetter(null);
    }
  }, [open, application]);

  const handlePreviewScore = async () => {
    if (!jobDescription.trim()) {
      setError("Paste the job description before scoring");
      return;
    }
    if (!company.trim() || !role.trim()) {
      setError("Company and Role are required before scoring");
      return;
    }
    setScoring(true);
    setError(null);
    try {
      const token = localStorage.getItem("insforge_token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE}/agent/preview-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ jobDescription: jobDescription.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewScore(data.score);
        setPreviewCoverLetter(data.cover_letter);
        setScored(true);
      } else {
        setError(data.error ?? "Scoring failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setScoring(false);
    }
  };

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
      ...(scored && previewScore
        ? {
            score_data: previewScore,
            cover_letter: previewCoverLetter || undefined,
          }
        : {}),
    });
    setSaving(false);
    if (result) {
      onClose();
    } else {
      setError("Failed to save application");
    }
  };

  function ScoreBadge({ value, label }: { value: number; label: string }) {
    const color = value >= 80 ? "text-green-400" : value >= 60 ? "text-amber-400" : "text-red-400";
    return (
      <div className="flex flex-col items-center rounded-lg bg-surface-light px-3 py-2">
        <span className={`text-lg font-bold ${color}`}>{value}</span>
        <span className="text-[10px] text-text-dim">{label}</span>
      </div>
    );
  }

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
                    <span className="ml-1.5 text-status-rejected">*</span>
                    <span className="ml-1 text-text-dim">(for scoring)</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (scored) {
                        setScored(false);
                        setPreviewScore(null);
                        setPreviewCoverLetter(null);
                      }
                    }}
                    rows={4}
                    placeholder="Paste the job description here..."
                    className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
                  />
                </div>
              </div>

              {!isEdit && jobDescription.trim() && !scored && (
                <button
                  type="button"
                  onClick={handlePreviewScore}
                  disabled={scoring}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-amber/20 px-5 py-2.5 text-xs font-medium text-amber transition-all hover:bg-amber/30 disabled:opacity-50"
                >
                  {scoring ? (
                    <>
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Scoring...
                    </>
                  ) : (
                    <>
                      <AiMagicIcon className="h-3.5 w-3.5" />
                      Score & Review
                    </>
                  )}
                </button>
              )}

              {previewScore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3 rounded-lg border border-amber/20 bg-amber/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Award01Icon className="h-4 w-4 text-amber" />
                    <span className="text-xs font-medium text-amber">Match Analysis</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <ScoreBadge value={previewScore.overall_score} label="Overall" />
                    <ScoreBadge value={previewScore.keyword_score} label="Keywords" />
                    <ScoreBadge value={previewScore.ats_score} label="ATS" />
                    <ScoreBadge value={previewScore.impact_score} label="Impact" />
                    <ScoreBadge value={previewScore.readability_score} label="Readability" />
                  </div>

                  {previewScore.improvements.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-[10px] font-mono font-medium text-text-muted">Improvements</p>
                      <ul className="space-y-1">
                        {previewScore.improvements.slice(0, 4).map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-text-dim">
                            <span className={`mt-0.5 shrink-0 rounded px-1 py-px text-[9px] font-mono font-medium ${
                              imp.tag === "ADD" ? "bg-green-900/30 text-green-400" :
                              imp.tag === "REPHRASE" ? "bg-amber-900/30 text-amber-400" :
                              "bg-blue-900/30 text-blue-400"
                            }`}>{imp.tag}</span>
                            <span>{imp.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewCoverLetter && (
                    <div>
                      <p className="mb-1.5 text-[10px] font-mono font-medium text-text-muted">Cover Letter Preview</p>
                      <p className="text-[11px] leading-relaxed text-text-dim line-clamp-3">{previewCoverLetter}</p>
                    </div>
                  )}
                </motion.div>
              )}

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
                  {saving ? "Saving..." : isEdit ? "Update" : "Log Application"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
