import { motion } from "framer-motion";
import type { SkillsMatch } from "@/types";

interface SkillsMatchBreakdownProps {
  skills: SkillsMatch[];
}

function getBarColor(percent: number) {
  if (percent >= 80) return "bg-emerald-500";
  if (percent >= 50) return "bg-amber";
  return "bg-red-400";
}

export function SkillsMatchBreakdown({ skills }: SkillsMatchBreakdownProps) {
  if (skills.length === 0) return null;

  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-4 text-xs font-medium text-text">Skills Match</h3>
      <div className="space-y-2.5">
        {skills.map((s, i) => (
          <div key={s.skill}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] text-text">{s.skill}</span>
              <span className="font-mono text-[10px] text-text-muted">{s.match_percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-light">
              <motion.div
                className={`h-full rounded-full ${getBarColor(s.match_percent)}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.match_percent}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
