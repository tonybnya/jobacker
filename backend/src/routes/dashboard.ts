import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";

const router = Router();
router.use(requireAuth);

const DB_URL = `${process.env.INSFORGE_URL}/api/database/v1`;

async function dbGet<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${DB_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;

    const [apps, scores] = await Promise.all([
      dbGet<unknown[]>(`/applications?select=id,status&user_id=eq.${userId}`, token),
      dbGet<unknown[]>(`/resume_scores?select=overall_score&user_id=eq.${userId}`, token),
    ]);

    const totalApplications = Array.isArray(apps) ? apps.length : 0;
    const applicationsList = Array.isArray(apps) ? apps as Array<{ status: string }> : [];
    const interviewsLanded = applicationsList.filter((a) => a.status === "interviewing" || a.status === "offer").length;
    const offersReceived = applicationsList.filter((a) => a.status === "offer").length;

    const scoreList = Array.isArray(scores) ? scores as Array<{ overall_score: number }> : [];
    const validScores = scoreList.filter((s) => typeof s.overall_score === "number");
    const avgResumeScore = validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + s.overall_score, 0) / validScores.length)
      : null;

    return res.json({
      success: true,
      stats: { totalApplications, avgResumeScore, interviewsLanded, offersReceived },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/activity", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;

    const [apps, resumeScores] = await Promise.all([
      dbGet<Array<{ id: string; company: string; role: string; status: string; created_at: string }>>(
        `/applications?select=id,company,role,status,created_at&user_id=eq.${userId}&order=created_at.desc&limit=10`,
        token,
      ),
      dbGet<Array<{ id: string; application_id: string; overall_score: number; cover_letter: string | null; tailored_resume_pdf_url: string | null; created_at: string }>>(
        `/resume_scores?select=id,application_id,overall_score,cover_letter,tailored_resume_pdf_url,created_at&user_id=eq.${userId}&order=created_at.desc&limit=10`,
        token,
      ),
    ]);

    const activities: Array<{ id: string; type: "score" | "application" | "cover_letter" | "tailored_resume"; description: string; timestamp: string; color: string }> = [];

    if (Array.isArray(apps)) {
      for (const app of apps) {
        activities.push({
          id: `app-${app.id}`,
          type: "application",
          description: `Applied to ${app.company} — ${app.role}`,
          timestamp: app.created_at,
          color: "amber",
        });
      }
    }

    if (Array.isArray(resumeScores)) {
      for (const score of resumeScores) {
        activities.push({
          id: `score-${score.id}`,
          type: "score",
          description: `Resume scored at ${score.overall_score}%`,
          timestamp: score.created_at,
          color: "emerald",
        });
        if (score.cover_letter) {
          activities.push({
            id: `cl-${score.id}`,
            type: "cover_letter",
            description: "Cover letter generated",
            timestamp: score.created_at,
            color: "blue",
          });
        }
        if (score.tailored_resume_pdf_url) {
          activities.push({
            id: `tr-${score.id}`,
            type: "tailored_resume",
            description: "Tailored resume PDF generated",
            timestamp: score.created_at,
            color: "purple",
          });
        }
      }
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const top10 = activities.slice(0, 10);

    return res.json({ success: true, activity: top10 });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;

    const [apps, scores] = await Promise.all([
      dbGet<Array<{ id: string; status: string; date_applied: string }>>(
        `/applications?select=id,status,date_applied&user_id=eq.${userId}`,
        token,
      ),
      dbGet<Array<{ overall_score: number }>>(
        `/resume_scores?select=overall_score&user_id=eq.${userId}`,
        token,
      ),
    ]);

    const appList = Array.isArray(apps) ? apps : [];
    const scoreList = Array.isArray(scores) ? scores : [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dateMap = new Map<string, number>();
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      dateMap.set(d.toISOString().split("T")[0], 0);
    }
    for (const app of appList) {
      const day = app.date_applied?.split("T")[0];
      if (day && dateMap.has(day)) dateMap.set(day, dateMap.get(day)! + 1);
    }
    const applicationsOverTime = Array.from(dateMap.entries()).map(([date, count]) => ({ date, count }));

    const ranges = ["0-59", "60-74", "75-89", "90-100"];
    const rangeMap = new Map(ranges.map((r) => [r, 0]));
    for (const s of scoreList) {
      const score = s.overall_score;
      if (score <= 59) rangeMap.set("0-59", rangeMap.get("0-59")! + 1);
      else if (score <= 74) rangeMap.set("60-74", rangeMap.get("60-74")! + 1);
      else if (score <= 89) rangeMap.set("75-89", rangeMap.get("75-89")! + 1);
      else rangeMap.set("90-100", rangeMap.get("90-100")! + 1);
    }
    const scoreDistribution = ranges.map((range) => ({ range, count: rangeMap.get(range)! }));

    const statusOrder = ["applied", "phone-screen", "interviewing", "offer", "rejected", "ghosted"];
    const statusMap = new Map(statusOrder.map((s) => [s, 0]));
    for (const app of appList) {
      if (statusMap.has(app.status)) statusMap.set(app.status, statusMap.get(app.status)! + 1);
    }
    const pipelineFunnel = statusOrder.map((status) => ({ status, count: statusMap.get(status)! }));

    return res.json({
      success: true,
      analytics: { applicationsOverTime, scoreDistribution, pipelineFunnel },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
