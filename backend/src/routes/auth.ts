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

router.post("/oauth/exchange", async (req: Request, res: Response) => {
  try {
    const { code, codeVerifier } = req.body;
    if (!code || !codeVerifier) {
      return res.status(400).json({ success: false, error: "code and codeVerifier are required" });
    }
    const response = await fetch(`${process.env.INSFORGE_URL}/api/auth/oauth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, code_verifier: codeVerifier }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(401).json({ success: false, error: "OAuth exchange failed" });
    }
    return res.json({
      success: true,
      data: {
        user: { id: data.user.id, email: data.user.email },
        accessToken: data.accessToken,
      },
    });
  } catch (error) {
    console.error("[auth/oauth/exchange]", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
