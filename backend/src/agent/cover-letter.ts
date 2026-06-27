import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

function buildCoverLetterPrompt(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string,
): string {
  return `Write a professional cover letter for the ${role} position at ${company}.

Use the candidate's actual resume information below. Every claim must be grounded in the candidate's real experience — never invent qualifications, employers, or credentials.

The cover letter should be 3-4 paragraphs, written for the international job market, and match the company's tone as inferred from the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the cover letter text — no preamble, no subject line, no signature placeholder.`;
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string,
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildCoverLetterPrompt(resumeText, jobDescription, company, role),
      config: { maxOutputTokens: 2048 },
    });

    const text = response.text;
    if (!text) {
      const candidate = response.candidates?.[0];
      const finishReason = candidate?.finishReason;
      const blockReason = response.promptFeedback?.blockReason;
      const detail = finishReason ? ` (finishReason: ${finishReason})` : blockReason ? ` (blockReason: ${blockReason})` : "";
      return { success: false, error: `Empty response from AI${detail}` };
    }

    return { success: true, text: text.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `Cover letter generation failed: ${message}` };
  }
}
