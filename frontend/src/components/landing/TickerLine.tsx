const ITEMS = [
  'RESUME SCORING', 'ATS COMPLIANCE', 'COVER LETTERS',
  'APPLICATION TRACKING', 'KEYWORD ANALYSIS', 'IMPACT PHRASES',
  'FUNNEL ANALYTICS', 'AI-POWERED INSIGHTS', 'ZERO FRICTION',
]

export function TickerLine() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden border-y border-border py-2">
      <div className="flex gap-12 whitespace-nowrap animate-ticker" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-mono tracking-widest text-text-dim flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-amber inline-block opacity-60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
