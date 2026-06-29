import { Router } from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/stats", requireAuth, async (_req, res) => {
  try {
    const [pages, sections, media, seo] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM pages"),
      pool.query("SELECT COUNT(*) AS count FROM page_sections"),
      pool.query("SELECT COUNT(*) AS count FROM media"),
      pool.query("SELECT COUNT(*) AS count FROM page_seo"),
    ]);

    res.json({
      pages: Number(pages.rows[0].count),
      sections: Number(sections.rows[0].count),
      media: Number(media.rows[0].count),
      seo: Number(seo.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

export default router;
