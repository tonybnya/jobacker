import { useState } from "react";
import { Edit01Icon } from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import type { Profile } from "@/types";

export function ProfilePage() {
  const { profile, loading, saving, uploading, saveProfile, uploadResume, error } = useProfile();
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-center text-xs text-text-muted">Could not load profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-text">Profile</h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage your personal details and base resume
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs text-text transition-colors hover:border-amber hover:text-amber"
        >
          <Edit01Icon className="h-3.5 w-3.5" />
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      <CompletionBanner hasResume={profile.resume_pdf_url !== null} />

      <div className="mt-6 space-y-6">
        <div className="glass divide-y divide-border">
          <div className="px-5 py-5">
            <ProfileFormFields profile={profile} editing={editing} saving={saving} onSave={saveProfile} />
          </div>
        </div>

        <div className="glass px-5 py-5">
          <ResumeUpload
            currentUrl={profile.resume_pdf_url}
            uploading={uploading}
            onUpload={uploadResume}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

function ProfileFormFields({
  profile,
  editing,
  saving,
  onSave,
}: {
  profile: Profile;
  editing: boolean;
  saving: boolean;
  onSave: (updates: Partial<Pick<Profile, "full_name" | "phone" | "location">>) => Promise<boolean>;
}) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [location, setLocation] = useState(profile.location ?? "");

  const handleSave = async () => {
    const ok = await onSave({ full_name: fullName, phone, location });
    if (ok) {
      // Collapse edit mode — parent will re-render with updated profile
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 text-xs font-medium text-text-muted">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          readOnly={!editing}
          placeholder="Enter your full name"
          className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber ${
            editing ? "border-amber/40" : "border-border cursor-default"
          } ${!editing ? "text-text-dim" : ""}`}
        />
      </div>

      <div>
        <label className="mb-1.5 text-xs font-medium text-text-muted">Email</label>
        <input
          type="email"
          value={profile.email ?? ""}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-dim outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 text-xs font-medium text-text-muted">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          readOnly={!editing}
          placeholder="+1 (555) 000-0000"
          className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber ${
            editing ? "border-amber/40" : "border-border cursor-default"
          } ${!editing ? "text-text-dim" : ""}`}
        />
      </div>

      <div>
        <label className="mb-1.5 text-xs font-medium text-text-muted">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          readOnly={!editing}
          placeholder="City, Country"
          className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber ${
            editing ? "border-amber/40" : "border-border cursor-default"
          } ${!editing ? "text-text-dim" : ""}`}
        />
      </div>

      {editing && (
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-5 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
