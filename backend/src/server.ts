import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "@/routes/auth";
import profileRoutes from "@/routes/profile";
import applicationsRoutes from "@/routes/applications";
import agentRoutes from "@/routes/agent";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/agent", agentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});
