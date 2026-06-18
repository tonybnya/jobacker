import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GoogleIcon, GithubIcon } from "hugeicons-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    if (mode === "signin") {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setBusy(false);
        return;
      }
      navigate(from, { replace: true });
    } else {
      const result = await signUp(email, password, name || undefined);
      if (result.error) {
        setError(result.error);
        setBusy(false);
        return;
      }
      if (result.requireEmailVerification) {
        setMessage("Check your email for a verification link, then sign in.");
        setMode("signin");
        setBusy(false);
        return;
      }
      navigate(from, { replace: true });
    }

    setBusy(false);
  };

  const handleOAuth = (provider: "google" | "github") => {
    signInWithOAuth(provider);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="glass rounded-xl p-6">
          <h1 className="mb-1 text-center text-xl font-light tracking-tight text-text">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mb-6 text-center font-mono text-[10px] tracking-wider text-text-muted">
            {mode === "signin" ? "Sign in to your account" : "Register for a new account"}
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-border-amber/40 bg-surface px-4 py-2 font-mono text-[11px] text-amber">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 font-mono text-[11px] text-text">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim focus:border-amber/50 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim focus:border-amber/50 focus:outline-none"
            />
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim focus:border-amber/50 focus:outline-none"
              />
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-1 w-full rounded-lg bg-[#F5F5F4] px-4 py-2.5 font-mono text-[12px] font-medium text-foreground transition-shadow hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              {busy ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] tracking-wider text-text-dim">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-[12px] text-text transition-colors hover:border-border-amber/30"
            >
              <GoogleIcon size={16} />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-[12px] text-text transition-colors hover:border-border-amber/30"
            >
              <GithubIcon size={16} />
              Continue with GitHub
            </button>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-text-muted">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); setMessage(null); }}
                  className="text-amber underline underline-offset-2"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
                  className="text-amber underline underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
