import type { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "@/lib/insforge";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  const token = header.slice(7);
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid or expired session" });
  }
  req.user = { id: user.id, email: user.email };
  next();
}
