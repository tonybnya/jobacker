import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { getApplication, getProfile, createResumeScore, updateResumeScore, getLatestScore, updateApplication, writeAgentLog } from "@/lib/insforge";
import { scoreResume } from "@/agent/scorer";
import { generateCoverLetter } from "@/agent/cover-letter";
import { generateTailoredResume } from "@/agent/resume-tailor";
import { generatePdfBuffer } from "@/agent/pdf-generator";

const VALID_TAGS = new Set(["ADD", "REPHRASE", "FORMAT"]);

function normalizeTag(tag: string): "ADD" | "REPHRASE" | "FORMAT" {
  if (VALID_TAGS.has(tag)) return tag as "ADD" | "REPHRASE" | "FORMAT";
  const lower = tag.toLowerCase();
  if (lower.includes("rephrase") || lower.includes("reword") || lower.includes("revis")) return "REPHRASE";
  if (lower.includes("format") || lower.includes("restructur") || lower.includes("reorder")) return "FORMAT";
  return "ADD";
}

const router = Router();

router.use(requireAuth);

router.post("/preview-score", async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body as { jobDescription?: string };
    if (!jobDescription) {
      return res.status(400).json({ success: false, error: "jobDescription is required" });
    }
    const token = req.headers.authorization!.slice(7);
    const profileResult = await getProfile(token, req.user!.id);
    if (!profileResult.data?.resume_text) {
      return res.status(400).json({ success: false, error: "Please upload your base resume in your profile first." });
    }
    const [scoreResult, coverLetterResult] = await Promise.all([
      scoreResume(profileResult.data.resume_text, jobDescription),
      generateCoverLetter(profileResult.data.resume_text, jobDescription, "", ""),
    ]);
    if (!scoreResult.success) {
      return res.status(500).json({ success: false, error: scoreResult.error });
    }
    return res.json({
      success: true,
      score: {
        overall_score: scoreResult.result.overall_score,
        keyword_score: scoreResult.result.keyword_score,
        ats_score: scoreResult.result.ats_score,
        impact_score: scoreResult.result.impact_score,
        readability_score: scoreResult.result.readability_score,
        skills_match: scoreResult.result.skills_match.map((s) => ({ skill: s.skill, match_percent: s.matchPercent })),
        pros: scoreResult.result.pros,
        cons: scoreResult.result.cons,
        missing_keywords: scoreResult.result.missing_keywords,
        improvements: scoreResult.result.improvements.map((i) => ({ tag: normalizeTag(i.tag), text: i.text })),
        sample_resume_text: scoreResult.result.sample_resume_text,
      },
      cover_letter: coverLetterResult.success ? coverLetterResult.text : null,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.post("/score", async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body as { applicationId?: string };
    if (!applicationId) {
      return res.status(400).json({ success: false, error: "applicationId is required" });
    }

    const token = req.headers.authorization!.slice(7);

    const appResult = await getApplication(token, applicationId, req.user!.id);
    if (!appResult.data) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    const application = appResult.data;

    if (!application.job_description) {
      return res.status(400).json({ success: false, error: "Job description is required. Paste one on the application detail page first." });
    }

    const profileResult = await getProfile(token, req.user!.id);
    if (!profileResult.data?.resume_text) {
      return res.status(400).json({ success: false, error: "Please upload your base resume in your profile before scoring." });
    }

    const agentResult = await scoreResume(profileResult.data.resume_text, application.job_description);
    if (!agentResult.success) {
      return res.status(500).json({ success: false, error: agentResult.error });
    }

    const { result } = agentResult;

    const normalizedSkills = (result.skills_match ?? []).map((s) => ({
      skill: s.skill,
      match_percent: s.matchPercent,
    }));

    const scorePayload: Record<string, unknown> = {
      application_id: applicationId,
      user_id: req.user!.id,
      overall_score: result.overall_score,
      keyword_score: result.keyword_score,
      ats_score: result.ats_score,
      impact_score: result.impact_score,
      readability_score: result.readability_score,
      skills_match: normalizedSkills,
      pros: result.pros,
      cons: result.cons,
      missing_keywords: result.missing_keywords,
      improvements: result.improvements.map((i) => ({ tag: normalizeTag(i.tag), text: i.text })),
      sample_resume_text: result.sample_resume_text,
      resume_text_used: profileResult.data.resume_text,
    };

    const scoreResult = await createResumeScore(token, scorePayload);
    if (!scoreResult.data) {
      await writeAgentLog(token, { application_id: applicationId, user_id: req.user!.id, action: "score", error: "Failed to save score" });
      return res.status(500).json({ success: false, error: "Failed to save score" });
    }

    await updateApplication(token, applicationId, req.user!.id, {
      latest_score_id: scoreResult.data.id,
    });

    const normalized = {
      ...scoreResult.data,
      skills_match: typeof scoreResult.data.skills_match === "string" ? JSON.parse(scoreResult.data.skills_match) : scoreResult.data.skills_match,
      pros: typeof scoreResult.data.pros === "string" ? JSON.parse(scoreResult.data.pros) : scoreResult.data.pros,
      cons: typeof scoreResult.data.cons === "string" ? JSON.parse(scoreResult.data.cons) : scoreResult.data.cons,
      missing_keywords: typeof scoreResult.data.missing_keywords === "string" ? JSON.parse(scoreResult.data.missing_keywords) : scoreResult.data.missing_keywords,
      improvements: typeof scoreResult.data.improvements === "string" ? JSON.parse(scoreResult.data.improvements) : scoreResult.data.improvements,
    };

    return res.json({ success: true, score: normalized });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    try {
      await writeAgentLog(req.headers.authorization!.slice(7), { application_id: req.body.applicationId, user_id: req.user!.id, action: "score", error: errorMessage });
    } catch {}
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

router.post("/cover-letter", async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body as { applicationId?: string };
    if (!applicationId) {
      return res.status(400).json({ success: false, error: "applicationId is required" });
    }

    const token = req.headers.authorization!.slice(7);

    const appResult = await getApplication(token, applicationId, req.user!.id);
    if (!appResult.data) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    const application = appResult.data;

    const profileResult = await getProfile(token, req.user!.id);
    const resumeText = profileResult.data?.resume_text;
    if (!resumeText) {
      return res.status(400).json({ success: false, error: "Please upload your base resume in your profile first." });
    }

    const scoreResult = await getLatestScore(token, applicationId, req.user!.id);
    if (!scoreResult.data) {
      return res.status(400).json({ success: false, error: "Please score your resume first." });
    }

    const agentResult = await generateCoverLetter(resumeText, application.job_description ?? "", application.company, application.role);
    if (!agentResult.success) {
      return res.status(500).json({ success: false, error: agentResult.error });
    }

    await updateResumeScore(token, scoreResult.data.id, req.user!.id, {
      cover_letter: agentResult.text,
    });

    return res.json({ success: true, cover_letter: agentResult.text });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    try {
      await writeAgentLog(req.headers.authorization!.slice(7), { application_id: req.body.applicationId, user_id: req.user!.id, action: "cover-letter", error: errorMessage });
    } catch {}
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

router.post("/tailor-resume", async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body as { applicationId?: string };
    if (!applicationId) {
      return res.status(400).json({ success: false, error: "applicationId is required" });
    }

    const token = req.headers.authorization!.slice(7);

    const appResult = await getApplication(token, applicationId, req.user!.id);
    if (!appResult.data) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    const application = appResult.data;

    const profileResult = await getProfile(token, req.user!.id);
    const resumeText = profileResult.data?.resume_text;
    if (!resumeText) {
      return res.status(400).json({ success: false, error: "Please upload your base resume in your profile first." });
    }

    const scoreResult = await getLatestScore(token, applicationId, req.user!.id);
    let sampleText: string;

    if (scoreResult.data?.sample_resume_text) {
      sampleText = scoreResult.data.sample_resume_text;
    } else {
      const agentResult = await generateTailoredResume(resumeText, application.job_description ?? "");
      if (!agentResult.success) {
        return res.status(500).json({ success: false, error: agentResult.error });
      }
      sampleText = agentResult.text;
    }

    const pdfBuffer = await generatePdfBuffer(sampleText);

    const storageKey = `resumes/${req.user!.id}/${applicationId}-tailored.pdf`;
    const storageUrl = `${process.env.INSFORGE_URL}/api/storage/buckets/resumes/objects/${encodeURIComponent(storageKey)}`;

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });
    formData.append("file", blob, "tailored.pdf");

    const uploadRes = await fetch(storageUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      return res.status(500).json({ success: false, error: "Failed to upload tailored PDF" });
    }

    const publicUrl = `${process.env.INSFORGE_URL}/api/storage/buckets/resumes/objects/${encodeURIComponent(storageKey)}`;

    if (scoreResult.data) {
      await updateResumeScore(token, scoreResult.data.id, req.user!.id, {
        sample_resume_text: sampleText,
        tailored_resume_pdf_url: publicUrl,
      });
    }

    return res.json({ success: true, sample_resume_text: sampleText, tailored_resume_pdf_url: publicUrl });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    try {
      await writeAgentLog(req.headers.authorization!.slice(7), { application_id: req.body.applicationId, user_id: req.user!.id, action: "tailor-resume", error: errorMessage });
    } catch {}
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
