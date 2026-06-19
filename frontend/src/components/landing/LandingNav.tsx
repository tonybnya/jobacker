import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { DashboardSquare01Icon, UserIcon, Folder01Icon, AnalysisTextLinkIcon, Logout05Icon } from 'hugeicons-react'
import logo from '@/assets/logo.png'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

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
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works'].map((item) => {
            const anchor = item.toLowerCase().replace(/\s+/g, '-')
            return (
              <a
                key={item}
                href={`/#${anchor}`}
                className="cursor-pointer text-xs text-text-muted hover:text-text transition-colors tracking-wide font-mono"
              >
                {item}
              </a>
            )
          })}
        </div>
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <DashboardSquare01Icon size={14} />
              Dashboard
            </Link>
            <Link
              to="/applications"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <Folder01Icon size={14} />
              Applications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <UserIcon size={14} />
              Profile
            </Link>
            <Link
              to="/applications"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <AnalysisTextLinkIcon size={14} />
              Scores
            </Link>
            <button
              onClick={handleSignOut}
              className="cursor-pointer flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <Logout05Icon size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="cursor-pointer text-xs font-mono text-text px-4 py-2 rounded-full hover:text-white transition-colors"
            >
              Sign in
            </a>
            <a
              href="/login?mode=signup"
              className="cursor-pointer text-xs font-mono bg-[#F5F5F4] text-foreground px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
            >
              Get started &rarr;
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
