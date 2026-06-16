import { useState, useEffect } from 'react'
import logo from '@/assets/logo.png'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Jobacker" className="w-6 h-6 rounded object-cover" />
          <span className="font-mono text-sm font-semibold tracking-tight text-text">JOBACKER</span>
          <span className="ml-1 text-[9px] font-mono px-1.5 py-0.5 rounded border border-amber/30 text-amber tracking-widest">
            ALPHA
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'Changelog'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-text-muted hover:text-text transition-colors tracking-wide font-mono"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs font-mono text-text px-4 py-2 rounded-full hover:text-white transition-colors">
            Sign in
          </button>
          <button className="text-xs font-mono bg-[#F5F5F4] text-foreground px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors">
            Get started &rarr;
          </button>
        </div>
      </div>
    </nav>
  )
}
