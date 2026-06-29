import { Router } from "express";
import { getHealthStatus } from "../lib/health.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "TagRobotech CMS API",
    version: "1.0.0",
    status: "running",
    health: "/api/health",
    endpoints: {
      health: "GET /api/health",
      auth: "/api/auth",
      admin: "/api/admin",
      pages: "/api/admin/pages",
      media: "/api/admin/media",
      public: "/api/public",
    },
  });
});

router.get("/health", async (_req, res) => {
  const health = await getHealthStatus();
  const statusCode = health.status === "ok" ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
