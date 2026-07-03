import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import pagesRoutes from "./routes/pages.js";
import mediaRoutes from "./routes/media.js";
import publicRoutes from "./routes/public.js";
import navigationRoutes from "./routes/navigation.js";
import leadsRoutes from "./routes/leads.js";
import { getHealthStatus } from "./lib/health.js";
import { UPLOAD_DIR } from "./lib/upload.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/health", async (_req, res) => {
  const health = await getHealthStatus();
  const statusCode = health.status === "ok" ? 200 : 503;
  res.status(statusCode).json({ ...health, note: "Use GET /api/health instead" });
});

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/pages", pagesRoutes);
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/navigation", navigationRoutes);
app.use("/api/admin/leads", leadsRoutes);
app.use("/api/public", publicRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`CMS API running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});
