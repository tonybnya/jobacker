import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

function buildScoringPrompt(resumeText: string, jobDescription: string): string {
  return `You are a resume scoring AI. Analyze the match between this resume and the job description.

Return ONLY valid JSON with no markdown formatting, no preamble, no explanation.

Required JSON structure — escape all quotes and newlines inside strings properly:
{
  "overall_score": <0-100>,
  "keyword_score": <0-100>,
  "ats_score": <0-100>,
  "impact_score": <0-100>,
  "readability_score": <0-100>,
  "skills_match": [{ "skill": "...", "matchPercent": <0-100> }],
  "pros": ["...", "..."],
  "cons": ["...", "..."],
  "missing_keywords": [{ "keyword": "...", "suggestion": "..." }],
  "improvements": [{ "tag": "ADD" | "REPHRASE" | "FORMAT", "text": "..." }],
  "sample_resume_text": "rewritten resume here — escape all inner quotes with backslash, replace newlines with \\n"
}

Important: For sample_resume_text, use real info from the resume only.
Escape all double quotes inside strings with backslash.
Do not include actual newlines in JSON string values — use \\n instead.

For improvements, tag must be exactly one of: ADD (missing content), REPHRASE (reword existing), FORMAT (structural fix). No other values are valid.

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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildScoringPrompt(resumeText, jobDescription),
      config: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      const candidate = response.candidates?.[0];
      const finishReason = candidate?.finishReason;
      const blockReason = response.promptFeedback?.blockReason;
      const detail = finishReason ? ` (finishReason: ${finishReason})` : blockReason ? ` (blockReason: ${blockReason})` : "";
      return { success: false, error: `Empty response from AI${detail}` };
    }

    let parsed: ScorerResult;
    let cleanText = text.trim();

    const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      cleanText = jsonMatch[1].trim();
    }

    const braceIdx = cleanText.indexOf("{");
    const lastBraceIdx = cleanText.lastIndexOf("}");
    if (braceIdx !== -1 && lastBraceIdx > braceIdx) {
      cleanText = cleanText.slice(braceIdx, lastBraceIdx + 1);
    }

    try {
      parsed = JSON.parse(cleanText) as ScorerResult;
    } catch (parseErr) {
      console.error("[scorer] raw text:", text.slice(0, 1000));
      console.error("[scorer] parse error:", parseErr instanceof Error ? parseErr.message : String(parseErr));
      console.error("[scorer] clean text:", cleanText.slice(0, 1000));
      return { success: false, error: `Failed to parse AI response: ${parseErr instanceof Error ? parseErr.message : "Invalid JSON"}` };
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
