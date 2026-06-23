interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export function ProsConsList({ pros, cons }: ProsConsListProps) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass rounded-xl border border-emerald-500/20 p-4">
        <h3 className="mb-3 text-xs font-medium text-emerald-400">Pros</h3>
        <ul className="space-y-2">
          {pros.length === 0 ? (
            <p className="text-[11px] text-text-dim">No pros identified yet.</p>
          ) : (
            pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-text-muted">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                {pro}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="glass rounded-xl border border-red-500/20 p-4">
        <h3 className="mb-3 text-xs font-medium text-red-400">Cons</h3>
        <ul className="space-y-2">
          {cons.length === 0 ? (
            <p className="text-[11px] text-text-dim">No cons identified yet.</p>
          ) : (
            cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-text-muted">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-red-500" />
                {con}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
