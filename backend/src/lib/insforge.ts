import { createClient } from "@insforge/sdk";

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
