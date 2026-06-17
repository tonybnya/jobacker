import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AmbientCanvas } from './AmbientCanvas'
import { HeroSketch } from './HeroSketch'
import { TickerLine } from './TickerLine'

const termLines = [
  { type: 'ok', text: 'Resume parsed → 2,847 tokens extracted' },
  { type: 'ld', text: 'Scanning job description for keywords...' },
  { type: 'ok', text: 'Match score computed → 87/100' },
  { type: 'ok', text: 'ATS compliance verified → PASS' },
  { type: 'ld', text: 'Generating tailored cover letter...' },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRowRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.fromTo(badgeRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .fromTo(
          headlineRef.current?.children ?? [],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
          '-=0.2',
        )
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo(ctaRowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .fromTo(terminalRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    })

    let i = 0
    const iv = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= termLines.length) clearInterval(iv)
    }, 700)

    return () => {
      clearInterval(iv)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      <AmbientCanvas />
      <div className="noise-overlay" />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 flex items-center pt-14">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            <div className="flex flex-col gap-6">
              <div ref={badgeRef} className="inline-flex items-center gap-2 w-fit">
                <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-amber" />
                  <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                    AI-Powered Job Application Tracker
                  </span>
                </div>
              </div>

              <div ref={headlineRef} className="flex flex-col gap-1">
                <h1
                  className="text-5xl md:text-6xl font-light leading-tight text-text"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Apply smarter.
                </h1>
                <h1 className="text-5xl md:text-6xl font-light leading-tight" style={{ letterSpacing: '-0.025em' }}>
                  <span className="text-gradient">Score higher.</span>
                </h1>
                <h1
                  className="text-5xl md:text-6xl font-light leading-tight text-text"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Land faster.
                </h1>
              </div>

              <p ref={subRef} className="text-sm text-text-muted leading-relaxed max-w-md font-light">
                Jobacker is your AI-powered co-pilot for the job hunt. Score your resume against any job description,
                generate tailored cover letters, and track every application — all in one place.
              </p>

              <div ref={ctaRowRef} className="flex items-center gap-4">
                <button className="group flex items-center gap-2 bg-[#F5F5F4] text-foreground text-xs font-mono font-medium px-5 py-3 rounded-lg hover:bg-white transition-all hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]">
                  Start tracking free{' '}
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
                <button className="flex items-center gap-2 text-xs font-mono text-text px-4 py-2.5 rounded-full glass hover:border-border-amber/30 transition-all">
                  <span className="w-4 h-4 rounded-full border border-text-muted flex items-center justify-center">
                    <span className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-text ml-0.5" />
                  </span>
                  See demo
                </button>
              </div>

              <div ref={terminalRef} className="glass rounded-xl p-4 mt-2 max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-solid" />
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-solid" />
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-solid" />
                  </div>
                  <span className="text-[9px] font-mono text-text-dim ml-2 tracking-wider">
                    JOBACKER_AGENT v0.1.0
                  </span>
                  <span className="ml-auto text-[9px] font-mono text-amber animate-pulse-amber">&bull; LIVE</span>
                </div>
                <div className="space-y-1.5">
                  {termLines.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] font-mono">
                      <span className={`shrink-0 mt-0.5 ${line.type === 'ok' ? 'text-amber' : 'text-text-muted'}`}>
                        [{line.type.toUpperCase()}]
                      </span>
                      <span className="text-text">{line.text}</span>
                    </div>
                  ))}
                  {visibleLines < termLines.length && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-text-dim">
                      <span>&#9654;</span>
                      <span className="animate-blink">_</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[7/6]">
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(69,26,3,0.4) 0%, transparent 70%)' }}
                />
                <HeroSketch />
              </div>
            </div>
          </div>
        </div>

        <TickerLine />
      </div>
    </section>
  )
}
