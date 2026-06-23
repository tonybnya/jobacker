import type { Improvement, ImprovementTag } from "@/types";

const TAG_STYLES: Record<ImprovementTag, string> = {
  ADD: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REPHRASE: "bg-amber/10 text-amber border-amber/20",
  FORMAT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

interface ImprovementsProps {
  improvements: Improvement[];
}

export function Improvements({ improvements }: ImprovementsProps) {
  if (improvements.length === 0) return null;

  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-4 text-xs font-medium text-text">Improvements</h3>
      <div className="space-y-2">
        {improvements.map((imp, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface-light px-4 py-3"
          >
            <span
              className={`inline-flex flex-shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-mono font-medium ${TAG_STYLES[imp.tag] ?? ""}`}
            >
              {imp.tag}
            </span>
            <span className="text-[11px] text-text-muted leading-relaxed">{imp.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
