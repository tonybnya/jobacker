import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4">
      <div className="glass rounded-xl p-8 text-center">
        <h1 className="text-gradient text-[60px] font-light leading-none tracking-tight">404</h1>
        <p className="mt-2 font-mono text-[11px] tracking-wider text-text-muted">
          Page not found
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-[#F5F5F4] px-5 py-2.5 font-mono text-[12px] font-medium text-foreground transition-shadow hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
