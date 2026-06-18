import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api-client";

const PKCE_VERIFIER_KEY = "insforge_pkce_verifier";

function retrievePkceVerifier(): string | null {
  try {
    const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
    if (verifier) {
      sessionStorage.removeItem(PKCE_VERIFIER_KEY);
    }
    return verifier;
  } catch {
    return null;
  }
}

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("insforge_code");

    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    const codeVerifier = retrievePkceVerifier();
    if (!codeVerifier) {
      navigate("/login", { replace: true });
      return;
    }

    const exchange = async () => {
      const { data, error } = await apiFetch<{
        user: { id: string; email: string };
        accessToken: string;
      }>("/api/auth/oauth/exchange", {
        method: "POST",
        body: JSON.stringify({ code, codeVerifier }),
      });

      if (error || !data) {
        navigate("/login", { replace: true });
        return;
      }

      localStorage.setItem("insforge_token", data.accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/dashboard", { replace: true });
    };

    exchange().catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="font-mono text-xs text-text-muted animate-pulse-amber">
        Completing authentication...
      </div>
    </div>
  );
}
