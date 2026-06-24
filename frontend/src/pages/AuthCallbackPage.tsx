import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "insforge_token";

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      for (let i = 0; i < 30; i++) {
        if (cancelled) return;
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          navigate("/dashboard", { replace: true });
          return;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      if (!cancelled) navigate("/login", { replace: true });
    };

    poll();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="font-mono text-xs text-text-muted animate-pulse-amber">
        Completing authentication...
      </div>
    </div>
  );
}
