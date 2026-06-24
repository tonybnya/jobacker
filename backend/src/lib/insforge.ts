import { createClient } from "@insforge/sdk";
import type { Profile, Application, ResumeScore } from "@/types";

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

function buildQueryString(params: Record<string, string | undefined>): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) parts.push(`${key}=${encodeURIComponent(val)}`);
  }
  return parts.length ? `&${parts.join("&")}` : "";
}

export function getApplications(
  token: string,
  userId: string,
  opts: { search?: string; status?: string; type?: string; sort?: string; page?: number; pageSize?: number } = {},
) {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const from = (page - 1) * pageSize;

  const sortCol = opts.sort === "oldest" ? "date_applied" : opts.sort === "score" ? "latest_score_id" : "date_applied";
  const sortOrder = opts.sort === "oldest" ? "asc" : "desc";

  const qs = buildQueryString({
    select: "*",
    user_id: `eq.${userId}`,
    ...(opts.search ? { or: `(company.ilike.*${opts.search}*,role.ilike.*${opts.search}*)` } : {}),
    ...(opts.status && opts.status !== "all" ? { status: `eq.${opts.status}` } : {}),
    ...(opts.type && opts.type !== "all" ? { type: `eq.${opts.type}` } : {}),
    order: `${sortCol}.${sortOrder}`,
    offset: String(from),
    limit: String(pageSize),
  });

  return dbFetch<Application[]>(`/applications?select=*${qs}`, token).then(async (r) => {
    let total = 0;
    try {
      const countRes = await fetch(
        `${DB_URL}/applications?select=id&user_id=eq.${userId}${opts.status && opts.status !== "all" ? `&status=eq.${opts.status}` : ""}${opts.type && opts.type !== "all" ? `&type=eq.${opts.type}` : ""}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
      );
      const countBody = await countRes.json();
      total = Array.isArray(countBody) ? countBody.length : 0;
    } catch {}
    return { data: r.data ?? [], error: r.error, total, page, pageSize };
  });
}

export function createApplication(token: string, userId: string, app: Partial<Application>) {
  return dbFetch<Application[]>(`/applications`, token, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...app, user_id: userId }),
  }).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}

export function getApplication(token: string, appId: string, userId: string) {
  return dbFetch<Application[]>(`/applications?select=*&id=eq.${appId}&user_id=eq.${userId}`, token).then(
    (r) => ({ data: r.data?.[0] ?? null, error: r.error }),
  );
}

export function updateApplication(token: string, appId: string, userId: string, updates: Partial<Application>) {
  return dbFetch<Application[]>(`/applications?id=eq.${appId}&user_id=eq.${userId}`, token, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(updates),
  }).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}

export function deleteApplication(token: string, appId: string, userId: string) {
  return dbFetch<null>(`/applications?id=eq.${appId}&user_id=eq.${userId}`, token, {
    method: "DELETE",
  }).then((r) => ({ data: r.data, error: r.error }));
}

export function getLatestScore(token: string, appId: string, userId: string) {
  return dbFetch<ResumeScore[]>(
    `/resume_scores?select=*&application_id=eq.${appId}&user_id=eq.${userId}&order=created_at.desc&limit=1`,
    token,
  ).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}

export function createResumeScore(token: string, score: Partial<ResumeScore>) {
  return dbFetch<ResumeScore[]>("/resume_scores", token, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(score),
  }).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}

export function updateResumeScore(token: string, id: string, userId: string, updates: Partial<ResumeScore>) {
  return dbFetch<ResumeScore[]>(`/resume_scores?id=eq.${id}&user_id=eq.${userId}`, token, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(updates),
  }).then((r) => ({ data: r.data?.[0] ?? null, error: r.error }));
}

export function writeAgentLog(token: string, entry: { application_id?: string; user_id: string; action: string; error: string }) {
  return dbFetch<unknown>("/agent_logs", token, {
    method: "POST",
    body: JSON.stringify({ ...entry, created_at: new Date().toISOString() }),
  }).then((r) => ({ data: r.data, error: r.error }));
}
