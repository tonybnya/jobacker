import { Router, type Request, type Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { getProfile, updateProfile } from "@/lib/insforge";
import { z } from "zod";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const updateSchema = z.object({
  full_name: z.string().max(255).optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(255).optional(),
});

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const { data, error } = await getProfile(token, req.user!.id);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.put("/", async (req: Request, res: Response) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }
    const token = req.headers.authorization!.slice(7);
    const { data, error } = await updateProfile(token, req.user!.id, parsed.data);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/resume", upload.single("resume"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const token = req.headers.authorization!.slice(7);
    const userId = req.user!.id;
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], { type: "application/pdf" });
    formData.append("file", blob, file.originalname);

    const uploadRes = await fetch(
      `${process.env.INSFORGE_URL}/api/storage/buckets/resumes/objects/${encodeURIComponent(fileName)}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    if (!uploadRes.ok) {
      const errBody = await uploadRes.json().catch(() => ({}));
      return res.status(500).json({ success: false, error: errBody.message ?? "Upload failed" });
    }

    const uploadData = (await uploadRes.json()) as { url: string; key: string };

    const { PDFParse } = await import("pdf-parse");
    const pdfDoc = new PDFParse({ data: new Uint8Array(file.buffer) });
    const pdfResult = await pdfDoc.getText();

    const { data: profileData, error: updateError } = await updateProfile(token, userId, {
      resume_pdf_url: uploadData.url,
      resume_text: pdfResult.text,
    });

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError });
    }

    return res.json({ success: true, data: { url: uploadData.url, profile: profileData } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Upload failed" });
  }
});

export default router;
