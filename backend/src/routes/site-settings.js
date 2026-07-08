import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getFooterSetting,
  getSiteBrandingSetting,
  setFooterSetting,
  setSiteBrandingSetting,
} from "../lib/site-settings.js";

const router = Router();

router.use(requireAuth);

router.get("/branding", async (_req, res) => {
  try {
    const settings = await getSiteBrandingSetting();
    res.json({ settings });
  } catch (error) {
    console.error("Branding get error:", error);
    res.status(500).json({ error: "Failed to load branding settings" });
  }
});

router.put("/branding", async (req, res) => {
  try {
    const settings = req.body?.settings ?? req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "Branding settings are required" });
    }

    await setSiteBrandingSetting(settings);
    res.json({ settings });
  } catch (error) {
    console.error("Branding save error:", error);
    res.status(500).json({ error: "Failed to save branding settings" });
  }
});

router.get("/footer", async (_req, res) => {
  try {
    const settings = await getFooterSetting();
    res.json({ settings });
  } catch (error) {
    console.error("Footer get error:", error);
    res.status(500).json({ error: "Failed to load footer settings" });
  }
});

router.put("/footer", async (req, res) => {
  try {
    const settings = req.body?.settings ?? req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "Footer settings are required" });
    }

    await setFooterSetting(settings);
    res.json({ settings });
  } catch (error) {
    console.error("Footer save error:", error);
    res.status(500).json({ error: "Failed to save footer settings" });
  }
});

export default router;
