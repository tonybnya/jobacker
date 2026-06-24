import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const redirectUrl = `/dashboard?${searchParams.toString()}`;
    navigate(redirectUrl, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="font-mono text-xs text-text-muted animate-pulse-amber">
        Completing authentication...
      </div>
    </div>
  );
}
