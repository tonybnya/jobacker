import { createClient } from "@insforge/sdk";
import type { Profile } from "@/types";

export const insforge = createClient({
  baseUrl: process.env.INSFORGE_URL!,
  anonKey: process.env.INSFORGE_API_KEY!,
});

export async function getUserFromToken(token: string) {
  try {
    const res = await fetch(`${process.env.INSFORGE_URL}/api/auth/sessions/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: { id: string; email: string } | null };
    return data.user ?? null;
  } catch (error) {
    console.error("[insforge/getUserFromToken]", error);
    return null;
  }
}

const DB_URL = `${process.env.INSFORGE_URL}/api/database/v1`;

async function dbFetch<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${DB_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });
    if (res.status === 204) return { data: null, error: null };
    const body = await res.json();
    if (!res.ok) return { data: null, error: body.message ?? body.error ?? "Request failed" };
    return { data: body as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

export function getProfile(token: string, userId: string) {
  return dbFetch<Profile[]>(`/profiles?select=*&user_id=eq.${userId}`, token).then(
    (r) => ({ data: r.data?.[0] ?? null, error: r.error }),
  );
}

export function updateProfile(token: string, userId: string, updates: Partial<Pick<Profile, "full_name" | "phone" | "location" | "resume_pdf_url" | "resume_text">>) {
  return dbFetch<Profile[]>(`/profiles?user_id=eq.${userId}`, token, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(updates),
  }).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}
