import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '@/assets/logo.png'

gsap.registerPlugin(ScrollTrigger)

// ─── Stats Bar ───────────────────────────────────────────────

const stats = [
  { value: '87%', label: 'Avg. ATS score lift' },
  { value: '4×', label: 'Faster application prep' },
  { value: '2.3k+', label: 'Resumes scored' },
  { value: '<30s', label: 'Time to full analysis' },
]

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current?.children ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="border-b border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {stats.map((s, i) => (
          <div key={i} className="py-8 px-6 first:pl-0">
            <div className="text-3xl font-light text-gradient mb-1" style={{ letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
            <div className="text-xs text-text-muted font-mono">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────

const features = [
  {
    tag: 'RESUME_ANALYSIS',
    title: 'Intelligent Resume Scoring',
    desc: 'Upload your resume and paste a job description. Our AI analyzes keyword density, impact phrases, structure, and ATS compliance — returning a score with actionable improvements.',
  },
  {
    tag: 'COVER_LETTER',
    title: 'Tailored Cover Letters',
    desc: "The agent reads the job posting and crafts a cover letter that mirrors the company's tone, highlights your relevant experience, and avoids generic phrases.",
  },
  {
    tag: 'APP_TRACKER',
    title: 'Application Pipeline',
    desc: 'Log every role you applied to. See it as a table or a visual funnel. Never lose track of where you stand — from "Applied" to "Offer".',
  },
  {
    tag: 'ANALYTICS',
    title: 'Dashboard & Analytics',
    desc: 'PostHog-powered analytics surface patterns in your search: response rates by industry, score correlation with interview rates, and a live activity feed.',
  },
  {
    tag: 'ATS_COMPLIANCE',
    title: 'ATS-First Optimization',
    desc: 'Most resumes fail before a human sees them. Jobacker verifies formatting, keyword placement, and section structure against real ATS parser behavior.',
  },
  {
    tag: 'PROFILE',
    title: 'One-time Profile Setup',
    desc: 'Set up your profile once. Jobacker remembers your skills, experience, and preferences — so every subsequent analysis is context-aware and deeply personalized.',
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current?.querySelectorAll('.feat-card') ?? [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" className="py-24 border-b border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-[10px] font-mono tracking-widest text-amber block mb-3">// CAPABILITIES</span>
          <h2 className="text-4xl font-light text-text max-w-lg" style={{ letterSpacing: '-0.02em' }}>
            Everything you need.<br />
            <span className="text-text-muted">Nothing you don&apos;t.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="feat-card group gradient-shell cursor-default">
              <div className="glass rounded-[11px] p-5 h-full flex flex-col gap-4 hover:bg-[rgba(28,25,23,0.8)] transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                    <span className="text-amber">◎</span>
                  </div>
                  <span className="text-[9px] font-mono text-text-dim tracking-wider mt-1">{f.tag}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">{f.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-light">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ────────────────────────────────────────────

const steps = [
  { n: '01', title: 'Create your profile', desc: 'Add your background, skills, and target roles once. The AI uses this context in every future analysis.' },
  { n: '02', title: 'Paste a job description', desc: 'Drop in any job posting URL or paste the text. Jobacker extracts the key requirements instantly.' },
  { n: '03', title: 'Upload your resume', desc: 'PDF or DOCX. The agent reads your resume and cross-references it against the job requirements.' },
  { n: '04', title: 'Get your score & fixes', desc: 'Receive a scored breakdown with specific improvements — reworded bullets, missing keywords, format fixes.' },
  { n: '05', title: 'Log your application', desc: 'One click to add it to your tracker. It joins your pipeline and analytics from that moment on.' },
]

const categoryScores = [
  { label: 'Keyword Match', val: 91 },
  { label: 'ATS Format', val: 100 },
  { label: 'Impact Phrases', val: 74 },
  { label: 'Readability', val: 88 },
]

const improvements = [
  { tag: 'ADD' as const, text: 'Include "React Server Components" in skills section' },
  { tag: 'REPHRASE' as const, text: '"Improved performance" → "Reduced TTI by 40% via code splitting"' },
  { tag: 'FORMAT' as const, text: 'Move certifications above projects for ATS parsing' },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current?.querySelectorAll('.step-item') ?? [],
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  const circumference = 2 * Math.PI * 34

  return (
    <section id="how-it-works" className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={ref}>
          <span className="text-[10px] font-mono tracking-widest text-amber block mb-3">// WORKFLOW</span>
          <h2 className="text-4xl font-light text-text mb-10" style={{ letterSpacing: '-0.02em' }}>
            Five steps.<br />
            <span className="text-text-muted">Zero friction.</span>
          </h2>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="step-item flex gap-5 group">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0 group-hover:border-border-amber/40 transition-colors">
                    <span className="text-[10px] font-mono text-amber">{s.n}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-8" />}
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-medium text-text mb-1">{s.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-light">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="gradient-shell">
            <div className="glass rounded-[11px] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[9px] font-mono text-text-muted tracking-wider block mb-0.5">
                    ANALYSIS_RESULT
                  </span>
                  <span className="text-sm font-medium text-text">
                    Senior Frontend Engineer @ Acme Corp
                  </span>
                </div>
                <span className="text-[9px] font-mono text-amber animate-pulse-amber">&bull; SCORED</span>
              </div>

              <div className="flex items-center gap-6 mb-5">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="var(--color-amber)"
                      strokeWidth="6"
                      strokeDasharray={`${circumference * 0.87} ${circumference * 0.13}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-light text-gold">87</span>
                    <span className="text-[8px] font-mono text-text-muted">/100</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {categoryScores.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[9px] font-mono text-text-muted mb-0.5">
                        <span>{item.label}</span>
                        <span className="text-text">{item.val}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-amber to-gold"
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-light rounded-lg p-3 space-y-2">
                <span className="text-[9px] font-mono text-text-muted tracking-wider">IMPROVEMENTS</span>
                {improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] font-mono">
                    <span
                      className={
                        `shrink-0 px-1 py-0.5 rounded text-[8px] font-medium ` +
                        (imp.tag === 'ADD'
                          ? 'bg-primary text-gold'
                          : imp.tag === 'REPHRASE'
                            ? 'bg-border text-text'
                            : 'bg-bg text-text-muted border border-border')
                      }
                    >
                      {imp.tag}
                    </span>
                    <span className="text-text-muted leading-relaxed">{imp.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pipeline ────────────────────────────────────────────────

type PipelineItem = { role: string; co: string; score: number; time: string }
type PipelineColumn = { label: string; count: number; color: string; items: PipelineItem[] }

const columns: PipelineColumn[] = [
  {
    label: 'Applied', count: 12, color: '#78716C',
    items: [
      { role: 'Sr. Frontend Eng.', co: 'Stripe', score: 87, time: '2d ago' },
      { role: 'Staff Engineer', co: 'Linear', score: 92, time: '3d ago' },
      { role: 'UI Engineer', co: 'Vercel', score: 79, time: '5d ago' },
    ],
  },
  {
    label: 'Interviewing', count: 3, color: '#F59E0B',
    items: [
      { role: 'Product Engineer', co: 'Notion', score: 94, time: '1d ago' },
      { role: 'React Engineer', co: 'Figma', score: 88, time: '6d ago' },
    ],
  },
  {
    label: 'Offer', count: 1, color: '#FBBF24',
    items: [
      { role: 'Sr. Engineer', co: 'Loom', score: 96, time: 'Today' },
    ],
  },
  {
    label: 'Archived', count: 4, color: '#44403C',
    items: [
      { role: 'Frontend Dev', co: 'Dropbox', score: 71, time: '2w ago' },
    ],
  },
]

export function PipelineSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current?.querySelectorAll('.col-card') ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-[10px] font-mono tracking-widest text-amber block mb-3">// PIPELINE_VIEW</span>
          <h2 className="text-4xl font-light text-text" style={{ letterSpacing: '-0.02em' }}>
            Your hunt,<br />
            <span className="text-text-muted">visualized.</span>
          </h2>
        </div>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {columns.map((col, ci) => (
            <div key={ci} className="col-card flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono tracking-wider" style={{ color: col.color }}>
                  {col.label}
                </span>
                <span className="text-[10px] font-mono text-text-dim">{col.count}</span>
              </div>
              {col.items.map((item, ii) => (
                <div key={ii} className="glass rounded-xl p-3 hover:border-border-amber/20 transition-colors cursor-default">
                  <div className="mb-2">
                    <div className="text-[11px] font-medium text-text leading-tight">{item.role}</div>
                    <div className="text-[10px] text-text-muted font-mono">{item.co}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-12 rounded-full bg-border">
                        <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: col.color }} />
                      </div>
                      <span className="text-[9px] font-mono" style={{ color: col.color }}>{item.score}</span>
                    </div>
                    <span className="text-[9px] font-mono text-text-dim">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ─────────────────────────────────────────────────────

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 text-center" ref={ref}>
        <span className="text-[10px] font-mono tracking-widest text-amber block mb-4">// START_NOW</span>
        <h2 className="text-5xl md:text-6xl font-light text-text mb-4" style={{ letterSpacing: '-0.025em' }}>
          Stop applying blind.
        </h2>
        <p className="text-sm text-text-muted mb-10 max-w-sm mx-auto font-light leading-relaxed">
          Join developers taking the guesswork out of the job hunt with a reliable AI-powered job application tracking system.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="/login?mode=signup"
            className="cursor-pointer group inline-flex items-center gap-2 bg-[#F5F5F4] text-foreground text-sm font-mono font-medium px-8 py-3.5 rounded-lg hover:bg-white transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
          >
            Create free account{' '}
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
          <span className="text-[10px] font-mono text-amber">No credit card required</span>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Jobacker" className="w-6 h-6 rounded object-cover" />
          <span className="text-xs font-mono text-text-muted">JOBACKER</span>
        </div>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'GitHub'].map((item) => (
            <a
              key={item}
              href={item === 'GitHub' ? 'https://github.com/tonybnya/jobacker' : '#'}
              target={item === 'GitHub' ? '_blank' : undefined}
              rel={item === 'GitHub' ? 'noopener noreferrer' : undefined}
              className="text-[11px] font-mono text-text-dim hover:text-text-muted transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <span className="text-[10px] font-mono text-text-dim">&copy; 2026 Jobacker</span>
      </div>
    </footer>
  )
}
