import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
}

interface StatsBarProps {
  stats: {
    totalApplications: number;
    avgResumeScore: number | null;
    interviewsLanded: number;
    offersReceived: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const items: Stat[] = [
    { label: "Total Applications", value: stats.totalApplications, color: "text-amber" },
    { label: "Avg. Resume Score", value: stats.avgResumeScore ?? "-", suffix: stats.avgResumeScore !== null ? "%" : undefined, color: "text-emerald-400" },
    { label: "Interviews Landed", value: stats.interviewsLanded, color: "text-blue-400" },
    { label: "Offers Received", value: stats.offersReceived, color: "text-gold" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="glass rounded-xl border border-border px-5 py-4"
        >
          <p className="text-[10px] font-mono font-medium tracking-wider text-text-muted">
            {item.label}
          </p>
          <p className={`mt-1.5 font-mono text-2xl font-bold ${item.color}`}>
            {item.value}
            {item.suffix && <span className="text-base text-text-dim">{item.suffix}</span>}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
