import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSquare01Icon, UserIcon, Folder01Icon, AnalysisTextLinkIcon, Logout05Icon } from "hugeicons-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-gold">JOBACKER</span>
        </Link>

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
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-text"
            >
              <Logout05Icon size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-[11px] text-text transition-colors hover:border-border-amber/30"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
