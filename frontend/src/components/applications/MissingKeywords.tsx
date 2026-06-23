import type { MissingKeyword } from "@/types";

interface MissingKeywordsProps {
  keywords: MissingKeyword[];
}

export function MissingKeywords({ keywords }: MissingKeywordsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="mb-3 text-xs font-medium text-text">Missing Keywords</h3>
      <p className="mb-4 text-[10px] text-text-muted">
        These keywords from the job description are missing from your resume. Consider adding them to improve your match score.
      </p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <div
            key={kw.keyword}
            className="group relative cursor-help rounded-lg border border-border bg-surface-light px-3 py-1.5"
          >
            <span className="text-[11px] text-amber">{kw.keyword}</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg border border-border bg-surface p-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <p className="text-[10px] text-text-muted">{kw.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
