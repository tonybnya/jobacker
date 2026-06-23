import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

function buildScoringPrompt(resumeText: string, jobDescription: string): string {
  return `Analyze the match between this resume and the job description below.

Return ONLY valid JSON matching this exact shape — no markdown, no preamble:

{
  "overall_score": number (0-100),
  "keyword_score": number (0-100),
  "ats_score": number (0-100),
  "impact_score": number (0-100),
  "readability_score": number (0-100),
  "skills_match": [
    { "skill": string, "matchPercent": number (0-100) }
  ],
  "pros": [string],
  "cons": [string],
  "missing_keywords": [
    { "keyword": string, "suggestion": string }
  ],
  "improvements": [
    { "tag": "ADD" | "REPHRASE" | "FORMAT", "text": string }
  ],
  "sample_resume_text": string
}

Instructions for each field:

1. skills_match — Compare skills listed in the resume against the job requirements. For each relevant skill, give a percentage match reflecting how well the candidate's experience aligns.

2. pros — Identify key strengths of the resume related to this position: areas where skills and experience align well with the job requirements.

3. cons — Identify weaknesses or gaps in the resume that may need attention, especially areas where the position requires skills or experience that are underrepresented or missing.

4. missing_keywords — Extract the top 15 key terms or phrases from the job description that are missing from the resume. For each, provide a brief suggestion on how to integrate it naturally.

5. improvements — Actionable suggestions to enhance the resume for this job. Each suggestion must be realistic and based on the resume's existing information — never invent experience the candidate doesn't have. Tag each suggestion as ADD (missing content to add), REPHRASE (existing content to reword), or FORMAT (structural/ATS formatting fix).

6. overall_score — A single percentage reflecting how well the resume demonstrates the skills, experience, and qualifications required for this specific job, considering both technical and soft skills.

7. sample_resume_text — A complete sample resume using the candidate's real information from the resume provided, written to be ATS-friendly and suitable for the international job market. Do not invent experience, employers, or credentials that are not present in the original resume — only rephrase, reorganize, and emphasize what is already there.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;
}

export interface ScorerResult {
  overall_score: number;
  keyword_score: number;
  ats_score: number;
  impact_score: number;
  readability_score: number;
  skills_match: Array<{ skill: string; matchPercent: number }>;
  pros: string[];
  cons: string[];
  missing_keywords: Array<{ keyword: string; suggestion: string }>;
  improvements: Array<{ tag: "ADD" | "REPHRASE" | "FORMAT"; text: string }>;
  sample_resume_text: string;
}

export async function scoreResume(
  resumeText: string,
  jobDescription: string,
): Promise<{ success: true; result: ScorerResult } | { success: false; error: string }> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: buildScoringPrompt(resumeText, jobDescription) }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      return { success: false, error: "Unexpected response format from AI" };
    }

    let parsed: ScorerResult;
    try {
      parsed = JSON.parse(block.text) as ScorerResult;
    } catch {
      return { success: false, error: "Failed to parse AI response" };
    }

    if (typeof parsed.overall_score !== "number") {
      return { success: false, error: "Invalid score data from AI" };
    }

    return { success: true, result: parsed };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `AI scoring failed: ${message}` };
  }
}
