import { useState } from "react";

interface CoverLetterProps {
  coverLetter: string | null;
  onGenerate: () => Promise<void>;
  generating: boolean;
}

export function CoverLetter({ coverLetter, onGenerate, generating }: CoverLetterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!coverLetter) {
    return (
      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-3 text-xs font-medium text-text">Cover Letter</h3>
        <p className="mb-4 text-[11px] text-text-muted">
          Generate a tailored cover letter for this application.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-5 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Cover Letter"}
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium text-text">Cover Letter</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-[10px] text-text-muted transition-colors hover:text-text"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto rounded-lg border border-border bg-surface-light p-4">
        <pre className="whitespace-pre-wrap font-mono text-[10px] text-text-muted leading-relaxed">
          {coverLetter}
        </pre>
      </div>
    </div>
  );
}
