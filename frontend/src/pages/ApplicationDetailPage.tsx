import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft01Icon } from "hugeicons-react";
import { useApplications } from "@/hooks/useApplications";
import { ScoreCard } from "@/components/applications/ScoreCard";
import { SkillsMatchBreakdown } from "@/components/applications/SkillsMatchBreakdown";
import { ProsConsList } from "@/components/applications/ProsConsList";
import { MissingKeywords } from "@/components/applications/MissingKeywords";
import { Improvements } from "@/components/applications/Improvements";
import { SampleResume } from "@/components/applications/SampleResume";
import { CoverLetter } from "@/components/applications/CoverLetter";
import { ApplicationInfo } from "@/components/applications/ApplicationInfo";
import type { Application, ResumeScore } from "@/types";

const TOKEN_KEY = "insforge_token";

function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, {
    ...options,
    headers: {
      ...(options?.method ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ""}`,
      ...options?.headers,
    },
  }).then((r) => r.json());
}

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-status-applied/10 text-status-applied",
  "phone-screen": "bg-status-phone/10 text-status-phone",
  interviewing: "bg-status-interview/10 text-status-interview",
  offer: "bg-status-offer/10 text-status-offer",
  rejected: "bg-status-rejected/10 text-status-rejected",
  ghosted: "bg-status-ghosted/10 text-status-ghosted",
};

const TYPE_COLORS: Record<string, string> = {
  remote: "bg-type-remote/10 text-type-remote",
  hybrid: "bg-type-hybrid/10 text-type-hybrid",
  "on-site": "bg-type-on-site/10 text-type-on-site",
  "part-time": "bg-type-part-time/10 text-type-part-time",
  internship: "bg-type-internship/10 text-type-internship",
  contract: "bg-type-contract/10 text-type-contract",
};

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, updateApplication } = useApplications();
  const [app, setApp] = useState<Application | null>(null);
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);

  useEffect(() => {
    const found = applications.find((a) => a.id === id);
    if (found) {
      setApp(found);
      setJobDescription(found.job_description ?? "");
    }
  }, [applications, id]);

  useEffect(() => {
    if (!app?.latest_score_id) {
      setScore(null);
      return;
    }
    setLoadingScore(true);
    fetchJson<{ success: boolean; score: ResumeScore | null }>(`/api/applications/${app.id}/score`)
      .then((data) => {
        if (data.success) setScore(data.score);
        else setScore(null);
      })
      .catch(() => setScore(null))
      .finally(() => setLoadingScore(false));
  }, [app?.id, app?.latest_score_id]);

  const handleScore = async () => {
    if (!app) return;
    setScoring(true);
    try {
      const data = await fetchJson<{ success: boolean; score: ResumeScore }>("/api/agent/score", {
        method: "POST",
        body: JSON.stringify({ applicationId: app.id }),
      });
      if (data.success) {
        setScore(data.score);
        setApp((prev) => prev ? { ...prev, latest_score_id: data.score.id } : prev);
      }
    } finally {
      setScoring(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!app) return;
    setGeneratingResume(true);
    try {
      const data = await fetchJson<{ success: boolean; sample_resume_text: string; tailored_resume_pdf_url: string }>("/api/agent/tailor-resume", {
        method: "POST",
        body: JSON.stringify({ applicationId: app.id }),
      });
      if (data.success && score) {
        setScore({ ...score, sample_resume_text: data.sample_resume_text, tailored_resume_pdf_url: data.tailored_resume_pdf_url });
      }
    } finally {
      setGeneratingResume(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!app) return;
    setGeneratingCover(true);
    try {
      const data = await fetchJson<{ success: boolean; cover_letter: string }>("/api/agent/cover-letter", {
        method: "POST",
        body: JSON.stringify({ applicationId: app.id }),
      });
      if (data.success && score) {
        setScore({ ...score, cover_letter: data.cover_letter });
      }
    } finally {
      setGeneratingCover(false);
    }
  };

  if (!app) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/applications"
        className="mb-6 flex items-center gap-1.5 text-[11px] text-text-muted transition-colors hover:text-amber"
      >
        <ArrowLeft01Icon className="h-3.5 w-3.5" />
        Back to Applications
      </Link>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-lg font-medium text-text">{app.company}</h1>
              <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-medium ${STATUS_COLORS[app.status] ?? ""}`}>
                {app.status === "phone-screen" ? "Phone" : app.status}
              </span>
              <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-medium ${TYPE_COLORS[app.type] ?? "bg-surface-light text-text-muted"}`}>
                {app.type}
              </span>
            </div>
            <p className="text-sm text-text-muted">{app.role}</p>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-text-dim">
              <span>{app.location ?? "No location specified"}</span>
              <span>{new Date(app.date_applied).toLocaleDateString()}</span>
              {app.job_url && (
                <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-amber underline">
                  View job posting
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <ScoreCard
            overallScore={score?.overall_score ?? 0}
            keywordScore={score?.keyword_score ?? 0}
            atsScore={score?.ats_score ?? 0}
            impactScore={score?.impact_score ?? 0}
            readabilityScore={score?.readability_score ?? 0}
            unscored={!app.latest_score_id && !loadingScore}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            onScore={handleScore}
            scoring={scoring}
          />

          {loadingScore && (
            <div className="flex items-center justify-center py-12">
              <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {score && (
            <>
              <SkillsMatchBreakdown skills={score.skills_match} />
              <ProsConsList pros={score.pros} cons={score.cons} />
              <MissingKeywords keywords={score.missing_keywords} />
              <Improvements improvements={score.improvements} />
              <SampleResume
                sampleText={score.sample_resume_text}
                tailoredPdfUrl={score.tailored_resume_pdf_url}
                onGenerate={handleGenerateResume}
                generating={generatingResume}
              />
              <CoverLetter
                coverLetter={score.cover_letter}
                onGenerate={handleGenerateCover}
                generating={generatingCover}
              />
            </>
          )}
        </div>

        <div className="col-span-1">
          <ApplicationInfo
            application={app}
            onSave={async (data) => {
              if (app) {
                await updateApplication(app.id, data);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
