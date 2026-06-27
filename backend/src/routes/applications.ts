import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { z } from "zod";
import {
  getApplications,
  getApplication,
  getProfile,
  createApplication,
  createProfile,
  updateApplication,
  deleteApplication,
  getLatestScore,
  createResumeScore,
  writeAgentLog,
} from "@/lib/insforge";

const router = Router();

router.use(requireAuth);

const createSchema = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  location: z.string().max(255).optional(),
  type: z.enum(["on-site", "part-time", "remote", "hybrid", "internship", "contract"]).optional(),
  job_url: z.string().max(2048).optional(),
  status: z.enum(["applied", "interviewing", "offer", "rejected", "phone-screen", "ghosted"]).optional(),
  date_applied: z.string().optional(),
  spy_status: z.enum(["unseen", "opened"]).optional(),
  follow_up_count: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  job_description: z.string().optional(),
  score_data: z.object({
    overall_score: z.number(),
    keyword_score: z.number(),
    ats_score: z.number(),
    impact_score: z.number(),
    readability_score: z.number(),
    skills_match: z.array(z.object({ skill: z.string(), match_percent: z.number() })),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    missing_keywords: z.array(z.object({ keyword: z.string(), suggestion: z.string() })),
    improvements: z.array(z.object({ tag: z.enum(["ADD", "REPHRASE", "FORMAT"]), text: z.string() })),
    sample_resume_text: z.string(),
  }).optional(),
  cover_letter: z.string().optional().nullable(),
});

const updateSchema = z.object({
  company: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(255).optional(),
  location: z.string().max(255).optional(),
  type: z.enum(["on-site", "part-time", "remote", "hybrid", "internship", "contract"]).optional(),
  job_url: z.string().max(2048).optional(),
  status: z.enum(["applied", "interviewing", "offer", "rejected", "phone-screen", "ghosted"]).optional(),
  date_applied: z.string().optional(),
  spy_status: z.enum(["unseen", "opened"]).optional(),
  follow_up_count: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  job_description: z.string().optional(),
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;
    const sort = req.query.sort as string | undefined;
    const page = req.query.page ? Number(req.query.page) : 1;

    const result = await getApplications(token, req.user!.id, {
      search,
      status,
      type,
      sort,
      page,
      pageSize: 20,
    });

    console.log("[applications] GET / result:", {
      userId: req.user!.id,
      dataCount: result.data?.length ?? 0,
      total: result.total,
      error: result.error,
    });

    if (result.error) return res.status(500).json({ success: false, error: result.error });

    return res.json({ success: true, data: result.data, total: result.total, page, pageSize: 20 });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const id = req.params.id as string;
    const { data, error } = await getApplication(token, id, req.user!.id);
    if (error) return res.status(500).json({ success: false, error });
    if (!data) return res.status(404).json({ success: false, error: "Application not found" });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      const msg = Object.entries(fields)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
        .join("; ");
      return res.status(400).json({ success: false, error: msg || "Invalid input" });
    }
    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;

    const existing = await getProfile(token, userId);
    if (!existing.data && existing.error) {
      return res.status(500).json({ success: false, error: existing.error });
    }
    if (!existing.data) {
      const { error: profileError } = await createProfile(token, userId, req.user!.email);
      if (profileError) {
        return res.status(500).json({ success: false, error: profileError });
      }
    }

    const { score_data, cover_letter, ...appData } = parsed.data;
    const { data, error } = await createApplication(token, userId, appData);
    console.log("[applications] create result:", { data: data ?? null, error });
    if (error) return res.status(500).json({ success: false, error });
    if (!data) return res.status(500).json({ success: false, error: "No data returned from database" });

    if (data && score_data) {
      const scorePayload: Record<string, unknown> = {
        application_id: data.id,
        user_id: userId,
        ...score_data,
        cover_letter: cover_letter ?? null,
      };
      const scoreResult = await createResumeScore(token, scorePayload);
      if (scoreResult.data) {
        await updateApplication(token, data.id, userId, {
          latest_score_id: scoreResult.data.id,
        });
        return res.status(201).json({ success: true, data: { ...data, latest_score_id: scoreResult.data.id } });
      }
      await writeAgentLog(token, { application_id: data.id, user_id: userId, action: "score", error: "Failed to save score during creation" });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      const msg = Object.entries(fields)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
        .join("; ");
      return res.status(400).json({ success: false, error: msg || "Invalid input" });
    }
    const token = req.headers.authorization!.slice(7);
    const id = req.params.id as string;
    const { data, error } = await updateApplication(token, id, req.user!.id, parsed.data);
    if (error) return res.status(500).json({ success: false, error });
    if (!data) return res.status(404).json({ success: false, error: "Application not found" });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/:id/score", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const id = req.params.id as string;
    const { data, error } = await getLatestScore(token, id, req.user!.id);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, score: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const id = req.params.id as string;
    const { error } = await deleteApplication(token, id, req.user!.id);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, data: null });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
