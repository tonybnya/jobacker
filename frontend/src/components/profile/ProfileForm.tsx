import { UserIcon, Mail01Icon, CallIcon, Location01Icon } from "hugeicons-react";
import type { Profile } from "@/types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <UserIcon className="h-3.5 w-3.5" />
          Full name
        </label>
        <input
          type="text"
          defaultValue={profile.full_name ?? ""}
          placeholder="Enter your full name"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <Mail01Icon className="h-3.5 w-3.5" />
          Email
        </label>
        <input
          type="email"
          defaultValue={profile.email ?? ""}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-dim outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <CallIcon className="h-3.5 w-3.5" />
          Phone
        </label>
        <input
          type="tel"
          defaultValue={profile.phone ?? ""}
          placeholder="+1 (555) 000-0000"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <Location01Icon className="h-3.5 w-3.5" />
          Location
        </label>
        <input
          type="text"
          defaultValue={profile.location ?? ""}
          placeholder="City, Country"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-amber"
        />
      </div>
    </div>
  );
}
