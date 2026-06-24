import { useState, useEffect, useCallback } from "react";
import { createClient } from "@insforge/sdk";
import { apiFetch } from "@/lib/api-client";
import type { User } from "@/types";

const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
});

export const TOKEN_KEY = "insforge_token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const storeToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem("insforge_token", token);
    } else {
      localStorage.removeItem("insforge_token");
    }
  }, []);

  const restoreSession = useCallback(async () => {
    const { data, error } = await insforge.auth.getCurrentUser();
    if (data?.user && !error) {
      setUser({ id: data.user.id, email: data.user.email ?? "" });
      const token = (insforge as any).tokenManager?.getAccessToken?.() ?? null;
      if (token) storeToken(token);
      setLoading(false);
      return data.user;
    }

    const storedToken = localStorage.getItem("insforge_token");
    if (storedToken) {
      const { data, error } = await apiFetch<{ user: User }>("/api/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (data?.user) {
        setUser(data.user);
        insforge.setAccessToken(storedToken);
        setLoading(false);
        return data.user;
      }
      localStorage.removeItem("insforge_token");
    }
    setLoading(false);
    return null;
  }, [storeToken]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (error || !data) return { error: error?.message ?? "Sign in failed" };
    if (!data.accessToken) return { error: "Sign in succeeded but no access token returned" };
    storeToken(data.accessToken);
    setUser({ id: data.user.id, email: data.user.email });
    return { error: null };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: error.message };
    if (data?.requireEmailVerification) {
      return { error: null, requireEmailVerification: true };
    }
    if (data?.accessToken) {
      storeToken(data.accessToken);
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      }
    }
    return { error: null, requireEmailVerification: false };
  };

  const signOut = async () => {
    await insforge.auth.signOut();
    storeToken(null);
    setUser(null);
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    const { data, error } = await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: `${window.location.origin}/dashboard`,
    });
    if (error || !data?.url) return;
    if (data.codeVerifier) {
      sessionStorage.setItem("insforge_code_verifier", data.codeVerifier);
    }
    window.location.href = data.url;
  };

  return { user, loading, signIn, signUp, signOut, signInWithOAuth, restoreSession };
}
