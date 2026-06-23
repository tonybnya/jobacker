import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
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
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: buildCoverLetterPrompt(resumeText, jobDescription, company, role),
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
    return { success: false, error: `Cover letter generation failed: ${message}` };
  }
}
