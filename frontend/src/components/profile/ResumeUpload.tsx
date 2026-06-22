import type { DragEvent, ChangeEvent } from "react";
import { useState, useRef, useCallback } from "react";
import { FileUploadIcon, CheckmarkCircle01Icon } from "hugeicons-react";

interface ResumeUploadProps {
  currentUrl: string | null;
  uploading: boolean;
  onUpload: (file: File) => Promise<boolean>;
}

export function ResumeUpload({ currentUrl, uploading, onUpload }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") {
        setFile(f);
        onUpload(f);
      }
    },
    [onUpload],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
        setFile(f);
        onUpload(f);
      }
    },
    [onUpload],
  );

  const hasFile = file !== null;
  const hasExisting = currentUrl !== null;

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-text">Base resume</p>

      {hasExisting && !file && (
        <div className="mb-3 flex items-center gap-2 text-xs text-emerald-400">
          <CheckmarkCircle01Icon className="h-4 w-4" />
          <span>Current resume uploaded</span>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver
            ? "border-amber bg-amber/5"
            : uploading
              ? "border-amber/40 opacity-60"
              : "border-border hover:border-text-muted"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-light">
          {uploading ? (
            <svg className="h-5 w-5 animate-spin text-amber" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <FileUploadIcon className="h-5 w-5 text-text-muted" />
          )}
        </div>

        {uploading ? (
          <p className="text-sm text-amber">Uploading...</p>
        ) : hasFile ? (
          <p className="text-sm text-amber">{file.name}</p>
        ) : (
          <>
            <p className="text-sm text-text">
              <span className="text-amber">Click to upload</span> or drag and
              drop
            </p>
            <p className="mt-1 text-xs text-text-muted">PDF only, max 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}
