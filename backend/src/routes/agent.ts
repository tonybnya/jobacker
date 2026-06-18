import { Router, type Request, type Response } from "express";

const router = Router();

router.all("*", (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: "Not implemented" });
});

export default router;
