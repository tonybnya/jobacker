import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

function buildTailorPrompt(resumeText: string, jobDescription: string): string {
  return `Rewrite the candidate's resume below to be ATS-friendly and tailored specifically for the job description.

Rules:
1. Use ONLY the candidate's real information from the resume — never invent employers, credentials, or experience.
2. Rephrase, reorganize, and emphasize what is already there to better match the job requirements.
3. Optimize for ATS parsing: standard section headers, clear formatting, keyword-rich bullet points.
4. Write for the international job market (use standard English, avoid jargon).

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the tailored resume text — no preamble, no explanation.`;
}

export async function generateTailoredResume(
  resumeText: string,
  jobDescription: string,
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildTailorPrompt(resumeText, jobDescription),
      config: { maxOutputTokens: 4096 },
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
    return { success: false, error: `Resume tailoring failed: ${message}` };
  }
}
