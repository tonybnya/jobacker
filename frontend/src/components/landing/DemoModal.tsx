import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Scene {
  tag: string;
  title: string[];
  content: React.ReactNode;
}

const AMBER = "#F59E0B";

const scenes: Scene[] = [
  {
    tag: "// RESUME_SCORING",
    title: ["Score your resume against", "any job description"],
    content: <ScoreScene />,
  },
  {
    tag: "// DASHBOARD_ANALYTICS",
    title: ["Track everything", "at a glance"],
    content: <DashboardScene />,
  },
  {
    tag: "// PIPELINE_VIEW",
    title: ["Visual Kanban", "pipeline"],
    content: <PipelineScene />,
  },
  {
    tag: "// COVER_LETTER",
    title: ["AI-generated cover", "letters in one click"],
    content: <CoverLetterScene />,
  },
];

function ScoreScene() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(41,37,36,0.8)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke={AMBER} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 52 * 0.87} ${2 * Math.PI * 52 * 0.13}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-light text-gold">87</span>
          <span className="text-[10px] font-mono text-text-muted">/100</span>
        </div>
      </div>
      <div className="space-y-2.5 min-w-[200px]">
        {[
          { label: "Keyword Match", val: 91 },
          { label: "ATS Format", val: 100 },
          { label: "Impact Phrases", val: 74 },
          { label: "Readability", val: 88 },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-0.5">
              <span>{item.label}</span>
              <span className="text-text">{item.val}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber to-gold"
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardScene() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-3">
        {[
          { label: "Total Apps", val: "24" },
          { label: "Avg. Score", val: "83%" },
          { label: "Interviews", val: "8" },
          { label: "Offers", val: "3" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl px-5 py-4 text-center border border-border min-w-[100px]">
            <div className="text-xl font-light text-gold">{s.val}</div>
            <div className="text-[9px] font-mono text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2 h-20">
        {[30, 55, 45, 70, 60, 85, 75, 90, 65, 80, 50, 40].map((h, i) => (
          <div
            key={i}
            className="w-5 rounded-t-sm bg-gradient-to-t from-amber to-gold opacity-80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function PipelineScene() {
  const cols = [
    { label: "Applied", count: 12, color: "#78716C" },
    { label: "Interviewing", count: 3, color: "#F59E0B" },
    { label: "Offer", count: 1, color: "#FBBF24" },
    { label: "Archived", count: 4, color: "#44403C" },
  ];
  return (
    <div className="flex gap-3">
      {cols.map((col, ci) => (
        <div key={ci} className="glass rounded-xl p-4 border border-border min-w-[130px]">
          <div className="text-[10px] font-mono mb-2" style={{ color: col.color }}>
            {col.label} ({col.count})
          </div>
          <div className="space-y-2">
            <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-2.5">
              <div className="text-[11px] font-medium text-text">Sr. Frontend Eng.</div>
              <div className="text-[9px] font-mono text-text-muted">Stripe</div>
              <div className="h-1 rounded-full bg-border mt-1.5">
                <div className="h-full rounded-full" style={{ width: "87%", background: col.color }} />
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-2.5">
              <div className="text-[11px] font-medium text-text">Staff Engineer</div>
              <div className="text-[9px] font-mono text-text-muted">Linear</div>
              <div className="h-1 rounded-full bg-border mt-1.5">
                <div className="h-full rounded-full" style={{ width: "92%", background: col.color }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoverLetterScene() {
  return (
    <div className="glass rounded-xl p-5 border border-border max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
        <span className="text-[9px] font-mono text-text-muted tracking-wider">GENERATING...</span>
      </div>
      <div className="text-xs text-text-muted leading-relaxed space-y-2">
        <p>Dear Hiring Team,</p>
        <p>
          I am writing to express my strong interest in the Senior Frontend Engineer
          position at Acme Corp. With over 8 years of experience building performant,
          accessible web applications...
        </p>
        <div className="flex items-center gap-2 pt-2">
          <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-amber to-gold" />
          </div>
          <span className="text-[9px] font-mono text-amber">87%</span>
        </div>
      </div>
    </div>
  );
}

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setSceneIdx((prev) => (prev + 1) % scenes.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!open) {
      setSceneIdx(0);
      setProgress(0);
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 1;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          setTimeout(advance, 800);
          return 99;
        }
        return next;
      });
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, sceneIdx, advance]);

  const scene = scenes[sceneIdx];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-3xl rounded-2xl border border-border bg-bg p-8"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mb-8">
              {scenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === sceneIdx ? "w-8 bg-amber" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={sceneIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6 min-h-[300px] justify-center"
              >
                <span className="text-[10px] font-mono tracking-widest text-amber">
                  {scene.tag}
                </span>
                <div className="text-center">
                  {scene.title.map((line, i) => (
                    <h3
                      key={i}
                      className="text-2xl font-light text-text"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {line}
                    </h3>
                  ))}
                </div>
                {scene.content}
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-8 h-0.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber to-gold transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] font-mono text-text-muted">
                {sceneIdx + 1} / {scenes.length}
              </span>
              <button
                onClick={advance}
                className="text-[10px] font-mono text-amber hover:text-gold transition-colors cursor-pointer"
              >
                Skip &rarr;
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
