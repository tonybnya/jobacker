import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import type { Profile } from "@/types";

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  saveProfile: (updates: Partial<Pick<Profile, "full_name" | "phone" | "location">>) => Promise<boolean>;
  uploadResume: (file: File) => Promise<boolean>;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Profile>("/profile")
      .then((res) => {
        if (res.success && res.data) setProfile(res.data);
        else setError(res.error ?? "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = useCallback(
    async (updates: Partial<Pick<Profile, "full_name" | "phone" | "location">>) => {
      setSaving(true);
      setError(null);
      const res = await apiFetch<Profile>("/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (res.success && res.data) {
        setProfile(res.data);
        setSaving(false);
        return true;
      }
      setError(res.error ?? "Failed to save profile");
      setSaving(false);
      return false;
    },
    [],
  );

  const uploadResume = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);

    const token = localStorage.getItem("insforge_token");
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_BASE}/profile/resume`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = (await res.json()) as { success: boolean; data?: { url: string }; error?: string };
      if (json.success) {
        setProfile((prev) => prev ? { ...prev, resume_pdf_url: json.data!.url } : prev);
        setUploading(false);
        return true;
      }
      setError(json.error ?? "Failed to upload resume");
      setUploading(false);
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
      return false;
    }
  }, []);

  return { profile, loading, saving, uploading, saveProfile, uploadResume, error };
}
