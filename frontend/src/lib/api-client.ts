const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = localStorage.getItem("insforge_token");
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    return (await res.json()) as { success: boolean; data?: T; error?: string };
  } catch (error) {
    console.error("[api-client]", error);
    return { success: false, error: "Network error. Please try again." };
  }
}
