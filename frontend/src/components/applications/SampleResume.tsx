import { useState } from "react";

interface SampleResumeProps {
  sampleText: string | null;
  tailoredPdfUrl: string | null;
  onGenerate: () => Promise<void>;
  generating: boolean;
}

export function SampleResume({ sampleText, tailoredPdfUrl, onGenerate, generating }: SampleResumeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!sampleText) return;
    await navigator.clipboard.writeText(sampleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sampleText && !tailoredPdfUrl) {
    return (
      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-3 text-xs font-medium text-text">Tailored Resume</h3>
        <p className="mb-4 text-[11px] text-text-muted">
          Generate an ATS-friendly resume tailored to this job description.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-5 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Tailored Resume"}
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium text-text">Tailored Resume</h3>
        <div className="flex items-center gap-2">
          {sampleText && (
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-[10px] text-text-muted transition-colors hover:text-text"
            >
              {copied ? "Copied!" : "Copy Text"}
            </button>
          )}
          {tailoredPdfUrl && (
            <a
              href={tailoredPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-amber px-2.5 py-1 text-[10px] font-medium text-primary"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
      {sampleText && (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-border bg-surface-light p-4">
          <pre className="whitespace-pre-wrap font-mono text-[10px] text-text-muted leading-relaxed">
            {sampleText}
          </pre>
        </div>
      )}
    </div>
  );
}
