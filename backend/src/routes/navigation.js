import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  FEATURES_MEGA_MENU_KEY,
  RESOURCES_MEGA_MENU_KEY,
  SOLUTIONS_MEGA_MENU_KEY,
  getMegaMenuSetting,
  setMegaMenuSetting,
} from "../lib/site-settings.js";

const router = Router();

router.use(requireAuth);

function registerMenuRoutes(key) {
  router.get(`/${key.replace("_mega_menu", "").replace("_", "-")}`, async (_req, res) => {
    try {
      const menu = await getMegaMenuSetting(`${key}`);
      res.json({ menu });
    } catch (error) {
      console.error(`Navigation get error (${key}):`, error);
      res.status(500).json({ error: "Failed to load navigation" });
    }
  });

  router.put(`/${key.replace("_mega_menu", "").replace("_", "-")}`, async (req, res) => {
    try {
      const menu = req.body?.menu ?? req.body;
      if (!menu || typeof menu !== "object") {
        return res.status(400).json({ error: "Menu payload is required" });
      }

      await setMegaMenuSetting(key, menu);
      res.json({ menu });
    } catch (error) {
      console.error(`Navigation save error (${key}):`, error);
      res.status(500).json({ error: "Failed to save navigation" });
    }
  });
}

// Explicit routes (cleaner URLs)
router.get("/resources", async (_req, res) => {
  try {
    res.json({ menu: await getMegaMenuSetting(RESOURCES_MEGA_MENU_KEY) });
  } catch (error) {
    console.error("Navigation get error:", error);
    res.status(500).json({ error: "Failed to load navigation" });
  }
});

router.put("/resources", async (req, res) => {
  try {
    const menu = req.body?.menu ?? req.body;
    if (!menu || typeof menu !== "object") {
      return res.status(400).json({ error: "Menu payload is required" });
    }
    await setMegaMenuSetting(RESOURCES_MEGA_MENU_KEY, menu);
    res.json({ menu });
  } catch (error) {
    console.error("Navigation save error:", error);
    res.status(500).json({ error: "Failed to save navigation" });
  }
});

router.get("/features", async (_req, res) => {
  try {
    res.json({ menu: await getMegaMenuSetting(FEATURES_MEGA_MENU_KEY) });
  } catch (error) {
    console.error("Navigation get error:", error);
    res.status(500).json({ error: "Failed to load navigation" });
  }
});

router.put("/features", async (req, res) => {
  try {
    const menu = req.body?.menu ?? req.body;
    if (!menu || typeof menu !== "object") {
      return res.status(400).json({ error: "Menu payload is required" });
    }
    await setMegaMenuSetting(FEATURES_MEGA_MENU_KEY, menu);
    res.json({ menu });
  } catch (error) {
    console.error("Navigation save error:", error);
    res.status(500).json({ error: "Failed to save navigation" });
  }
});

router.get("/solutions", async (_req, res) => {
  try {
    res.json({ menu: await getMegaMenuSetting(SOLUTIONS_MEGA_MENU_KEY) });
  } catch (error) {
    console.error("Navigation get error:", error);
    res.status(500).json({ error: "Failed to load navigation" });
  }
});

router.put("/solutions", async (req, res) => {
  try {
    const menu = req.body?.menu ?? req.body;
    if (!menu || typeof menu !== "object") {
      return res.status(400).json({ error: "Menu payload is required" });
    }
    await setMegaMenuSetting(SOLUTIONS_MEGA_MENU_KEY, menu);
    res.json({ menu });
  } catch (error) {
    console.error("Navigation save error:", error);
    res.status(500).json({ error: "Failed to save navigation" });
  }
});

export default router;
