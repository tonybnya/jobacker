import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroSketch() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll('.sketch-path')
    const circles = svg.querySelectorAll('.sketch-circle')
    const labels = svg.querySelectorAll('.sketch-label')
    const crosshairs = svg.querySelectorAll('.sketch-crosshair')

    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 800, strokeDashoffset: 800, opacity: 0 })
      gsap.set(circles, { scale: 0, transformOrigin: 'center', opacity: 0 })
      gsap.set(labels, { opacity: 0, x: -10 })
      gsap.set(crosshairs, { scale: 0, transformOrigin: 'center', opacity: 0 })

      const tl = gsap.timeline({ delay: 0.8 })

      tl.to(paths, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.8,
        ease: 'power2.out',
        stagger: 0.15,
      })
        .to(
          circles,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            stagger: 0.1,
          },
          '-=1.2',
        )
        .to(
          crosshairs,
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            stagger: 0.08,
          },
          '-=0.8',
        )
        .to(
          labels,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          '-=0.6',
        )

      gsap.to(circles, {
        scale: 1.05,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      })

      gsap.to(crosshairs, {
        rotation: 5,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
        transformOrigin: 'center',
      })
    }, svg)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 560 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.08))' }}
    >
      <line className="sketch-path" x1="0" y1="120" x2="560" y2="120" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />
      <line className="sketch-path" x1="0" y1="240" x2="560" y2="240" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />
      <line className="sketch-path" x1="0" y1="360" x2="560" y2="360" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />
      <line className="sketch-path" x1="140" y1="0" x2="140" y2="480" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />
      <line className="sketch-path" x1="280" y1="0" x2="280" y2="480" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />
      <line className="sketch-path" x1="420" y1="0" x2="420" y2="480" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 8" />

      <circle className="sketch-circle" cx="168" cy="180" r="72" stroke="var(--color-amber)" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.4" />
      <circle className="sketch-circle" cx="168" cy="180" r="48" stroke="var(--color-amber)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      <circle className="sketch-circle" cx="168" cy="180" r="28" stroke="var(--color-gold)" strokeWidth="1.2" opacity="0.8" />
      <circle className="sketch-crosshair" cx="168" cy="180" r="8" stroke="var(--color-gold)" strokeWidth="2" fill="rgba(251,191,36,0.1)" />
      <circle className="sketch-crosshair" cx="168" cy="180" r="2" fill="var(--color-gold)" opacity="0.9" />

      <line className="sketch-path" x1="168" y1="96" x2="168" y2="152" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.7" />
      <line className="sketch-path" x1="168" y1="208" x2="168" y2="264" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.7" />
      <line className="sketch-path" x1="84" y1="180" x2="140" y2="180" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.7" />
      <line className="sketch-path" x1="196" y1="180" x2="252" y2="180" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.7" />

      <rect className="sketch-label" x="100" y="100" width="136" height="24" rx="4" fill="rgba(28,25,23,0.8)" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.9" />
      <text className="sketch-label" x="168" y="116" textAnchor="middle" fill="var(--color-gold)" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="500">RESUME_SCORE: 87/100</text>

      <circle className="sketch-circle" cx="392" cy="300" r="64" stroke="var(--color-text-muted)" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.3" />
      <circle className="sketch-circle" cx="392" cy="300" r="42" stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      <circle className="sketch-circle" cx="392" cy="300" r="24" stroke="var(--color-text)" strokeWidth="1" opacity="0.6" />
      <circle className="sketch-crosshair" cx="392" cy="300" r="7" stroke="var(--color-text)" strokeWidth="1.5" fill="rgba(214,211,209,0.08)" />
      <circle className="sketch-crosshair" cx="392" cy="300" r="2" fill="var(--color-text)" opacity="0.7" />

      <line className="sketch-path" x1="392" y1="228" x2="392" y2="276" stroke="var(--color-text-muted)" strokeWidth="0.8" opacity="0.6" />
      <line className="sketch-path" x1="392" y1="324" x2="392" y2="372" stroke="var(--color-text-muted)" strokeWidth="0.8" opacity="0.6" />
      <line className="sketch-path" x1="320" y1="300" x2="368" y2="300" stroke="var(--color-text-muted)" strokeWidth="0.8" opacity="0.6" />
      <line className="sketch-path" x1="416" y1="300" x2="468" y2="300" stroke="var(--color-text-muted)" strokeWidth="0.8" opacity="0.6" />

      <rect className="sketch-label" x="332" y="228" width="120" height="22" rx="4" fill="rgba(28,25,23,0.8)" stroke="var(--color-text-muted)" strokeWidth="0.8" />
      <text className="sketch-label" x="392" y="243" textAnchor="middle" fill="var(--color-text)" fontSize="9" fontFamily="JetBrains Mono, monospace">ATS_MATCH: 94%</text>

      <line className="sketch-path" x1="240" y1="180" x2="328" y2="300" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />

      <path className="sketch-path" d="M 260 140 L 320 100 L 380 80" stroke="var(--color-text-muted)" strokeWidth="0.8" fill="none" strokeDasharray="3 4" />
      <circle className="sketch-crosshair" cx="380" cy="80" r="3" fill="var(--color-text-muted)" opacity="0.6" />
      <rect className="sketch-label" x="330" y="56" width="140" height="22" rx="4" fill="rgba(28,25,23,0.9)" stroke="var(--color-border)" strokeWidth="0.8" />
      <text className="sketch-label" x="400" y="71" textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="JetBrains Mono, monospace">KEYWORD_DENSITY</text>

      <path className="sketch-path" d="M 168 252 L 168 310 L 120 360" stroke="var(--color-text-muted)" strokeWidth="0.8" fill="none" strokeDasharray="3 4" />
      <circle className="sketch-crosshair" cx="120" cy="360" r="3" fill="var(--color-gold)" opacity="0.6" />
      <rect className="sketch-label" x="32" y="356" width="116" height="22" rx="4" fill="rgba(28,25,23,0.9)" stroke="var(--color-border)" strokeWidth="0.8" />
      <text className="sketch-label" x="90" y="371" textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="JetBrains Mono, monospace">IMPACT_PHRASES</text>

      <path className="sketch-path" d="M 450 240 L 490 200 L 530 200" stroke="var(--color-text-muted)" strokeWidth="0.8" fill="none" />
      <rect className="sketch-label" x="440" y="190" width="108" height="20" rx="3" fill="rgba(28,25,23,0.9)" stroke="var(--color-border)" strokeWidth="0.8" />
      <text className="sketch-label" x="494" y="204" textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="JetBrains Mono, monospace">COVER_LETTER</text>

      <path className="sketch-path" d="M 20 20 L 20 60 M 20 20 L 60 20" stroke="var(--color-surface-solid)" strokeWidth="1" />
      <path className="sketch-path" d="M 540 20 L 540 60 M 540 20 L 500 20" stroke="var(--color-surface-solid)" strokeWidth="1" />
      <path className="sketch-path" d="M 20 460 L 20 420 M 20 460 L 60 460" stroke="var(--color-surface-solid)" strokeWidth="1" />
      <path className="sketch-path" d="M 540 460 L 540 420 M 540 460 L 500 460" stroke="var(--color-surface-solid)" strokeWidth="1" />

      <circle className="sketch-circle" cx="72" cy="72" r="10" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.3" />
      <circle className="sketch-crosshair" cx="72" cy="72" r="3" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.5" />
      <line className="sketch-path" x1="72" y1="56" x2="72" y2="62" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.5" />
      <line className="sketch-path" x1="72" y1="82" x2="72" y2="88" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.5" />
      <line className="sketch-path" x1="56" y1="72" x2="62" y2="72" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.5" />
      <line className="sketch-path" x1="82" y1="72" x2="88" y2="72" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.5" />

      <circle className="sketch-circle" cx="488" cy="420" r="12" stroke="var(--color-text-muted)" strokeWidth="0.6" opacity="0.3" />
      <circle className="sketch-crosshair" cx="488" cy="420" r="4" stroke="var(--color-text-muted)" strokeWidth="0.8" opacity="0.4" />
      <line className="sketch-path" x1="488" y1="404" x2="488" y2="410" stroke="var(--color-text-muted)" strokeWidth="0.6" opacity="0.4" />
      <line className="sketch-path" x1="488" y1="430" x2="488" y2="436" stroke="var(--color-text-muted)" strokeWidth="0.6" opacity="0.4" />
      <line className="sketch-path" x1="472" y1="420" x2="478" y2="420" stroke="var(--color-text-muted)" strokeWidth="0.6" opacity="0.4" />
      <line className="sketch-path" x1="498" y1="420" x2="504" y2="420" stroke="var(--color-text-muted)" strokeWidth="0.6" opacity="0.4" />

      <rect className="sketch-label" x="72" y="400" width="200" height="40" rx="6" fill="rgba(28,25,23,0.85)" stroke="var(--color-border)" strokeWidth="0.8" />
      <text className="sketch-label" x="82" y="415" fill="var(--color-text-muted)" fontSize="8" fontFamily="JetBrains Mono, monospace">MATCH_QUALITY</text>
      <rect className="sketch-label" x="82" y="420" width="160" height="6" rx="3" fill="var(--color-border)" />
      <rect className="sketch-label" x="82" y="420" width="139" height="6" rx="3" fill="var(--color-amber)" opacity="0.8" />
      <text className="sketch-label" x="255" y="428" fill="var(--color-gold)" fontSize="8" fontFamily="JetBrains Mono, monospace">87%</text>
    </svg>
  )
}
