import { AlertCircleIcon } from "hugeicons-react";

interface CompletionBannerProps {
  hasResume: boolean;
}

export function CompletionBanner({ hasResume }: CompletionBannerProps) {
  if (hasResume) {
    return (
      <div className="glass-light flex items-center gap-3 border border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10">
          <span className="text-xs text-amber">done</span>
        </div>
        <div>
          <p className="text-sm font-medium text-text">Profile complete</p>
          <p className="text-xs text-text-muted">Your base resume is uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-shell">
      <div className="glass flex items-start gap-3 px-5 py-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/10">
          <AlertCircleIcon className="h-4 w-4 text-amber" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber">Resume required</p>
          <p className="mt-1 text-xs text-text-muted">
            Upload your base resume below to unlock resume scoring and tailored
            applications.
          </p>
        </div>
      </div>
    </div>
  );
}
