import { useState, useEffect, useCallback } from "react";
import { createClient } from "@insforge/sdk";
import { apiFetch } from "@/lib/api-client";
import type { User } from "@/types";

const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
});

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
    const token = localStorage.getItem("insforge_token");
    if (!token) {
      setLoading(false);
      return null;
    }
    const { data, error } = await apiFetch<{ user: User }>("/api/auth/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data?.user) {
      setUser(data.user);
      setLoading(false);
      return data.user;
    }
    localStorage.removeItem("insforge_token");
    setLoading(false);
    return null;
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (error || !data) return { error: error?.message ?? "Sign in failed" };
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
    const { data, error } = await insforge.auth.signInWithOAuth(provider, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error || !data?.url) return;
    window.location.href = data.url;
  };

  return { user, loading, signIn, signUp, signOut, signInWithOAuth, restoreSession };
}
