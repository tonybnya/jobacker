import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
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
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: buildTailorPrompt(resumeText, jobDescription),
        },
      ],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      return { success: false, error: "Unexpected response format from AI" };
    }

    return { success: true, text: block.text.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `Resume tailoring failed: ${message}` };
  }
}
