import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { z } from "zod";
import {
  getApplications,
  getApplication,
  createApplication,
  createProfile,
  updateApplication,
  deleteApplication,
  getLatestScore,
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

    const { data, error, total } = await getApplications(token, req.user!.id, {
      search,
      status,
      type,
      sort,
      page,
      pageSize: 20,
    });

    if (error) return res.status(500).json({ success: false, error });

    return res.json({ success: true, data, total, page, pageSize: 20 });
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
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }
    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;
    const { error: profileError } = await createProfile(token, userId, req.user!.email);
    if (profileError && !profileError.includes("duplicate key")) {
      return res.status(500).json({ success: false, error: profileError });
    }
    const { data, error } = await createApplication(token, userId, parsed.data);
    if (error) return res.status(500).json({ success: false, error });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
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
