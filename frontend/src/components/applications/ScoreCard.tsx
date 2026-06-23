import { motion } from "framer-motion";

interface ScoreCardProps {
  overallScore: number;
  keywordScore: number;
  atsScore: number;
  impactScore: number;
  readabilityScore: number;
  unscored?: boolean;
  jobDescription: string;
  onJobDescriptionChange: (val: string) => void;
  onScore: () => void;
  scoring: boolean;
}

export function ScoreCard({
  overallScore,
  keywordScore,
  atsScore,
  impactScore,
  readabilityScore,
  unscored,
  jobDescription,
  onJobDescriptionChange,
  onScore,
  scoring,
}: ScoreCardProps) {
  if (unscored) {
    return (
      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-3 text-xs font-medium text-text">Score My Resume</h3>
        <p className="mb-4 text-[11px] text-text-muted">
          Paste the job description below to see how your resume matches this role.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="mb-4 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-text outline-none placeholder:text-text-dim focus:border-amber"
        />
        <button
          type="button"
          onClick={onScore}
          disabled={scoring || !jobDescription.trim()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-5 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {scoring ? "Scoring..." : "Score My Resume"}
        </button>
      </div>
    );
  }

  const bars = [
    { label: "Keyword Match", value: keywordScore, color: "bg-blue-500" },
    { label: "ATS Compliance", value: atsScore, color: "bg-emerald-500" },
    { label: "Impact Phrases", value: impactScore, color: "bg-amber" },
    { label: "Readability", value: readabilityScore, color: "bg-purple-500" },
  ];

  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-5 text-xs font-medium text-text">Resume Score</h3>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 flex flex-col items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r="48" fill="none" stroke="var(--color-border)" strokeWidth="6" />
            <motion.circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <span className="mt-2 font-mono text-2xl font-bold text-text">{overallScore}%</span>
          <span className="text-[10px] text-text-muted">Overall Match</span>
        </div>
        <div className="col-span-3 space-y-3">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">{bar.label}</span>
                <span className="font-mono text-[10px] text-text">{bar.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-light">
                <motion.div
                  className={`h-full rounded-full ${bar.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
