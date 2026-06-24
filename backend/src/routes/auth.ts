import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { getUserFromToken } from "@/lib/insforge";

const router = Router();

router.post("/session", async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }
    const token = header.slice(7);
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid or expired session" });
    }
    return res.json({ success: true, data: { user: { id: user.id, email: user.email } } });
  } catch (error) {
    console.error("[auth/session]", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/me", requireAuth, (req: Request, res: Response) => {
  return res.json({ success: true, data: { user: req.user } });
});

export default router;
