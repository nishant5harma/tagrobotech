import { Router } from "express";
import pool from "../db/pool.js";
import {
  FEATURES_MEGA_MENU_KEY,
  RESOURCES_MEGA_MENU_KEY,
  SOLUTIONS_MEGA_MENU_KEY,
  getFeaturesMegaMenuSetting,
  getResourcesMegaMenuSetting,
  getSolutionsMegaMenuSetting,
  enrichMegaMenuFeaturedImage,
  resolveMenuLinks,
} from "../lib/site-settings.js";

const router = Router();

function parseSectionRow(row) {
  if (!row || typeof row.data !== "string") return row;
  try {
    return { ...row, data: JSON.parse(row.data) };
  } catch {
    return { ...row, data: {} };
  }
}

function parseSeoRow(row) {
  if (!row) return row;
  if (typeof row.schema_json === "string") {
    try {
      return { ...row, schema_json: JSON.parse(row.schema_json) };
    } catch {
      return { ...row, schema_json: null };
    }
  }
  return row;
}

function slugFromParam(param) {
  if (param === "home") return "/";
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

function absoluteAssetUrl(fileUrl, req) {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  const base = process.env.PUBLIC_ASSET_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}${fileUrl}`;
}

async function enrichSectionsWithMedia(sections, req) {
  const mediaIds = new Set();

  for (const section of sections) {
    const data = section.data;
    if (!data) continue;

    if (section.section_type === "hero") {
      if (data.image_id) mediaIds.add(data.image_id);
      if (data.video_id) mediaIds.add(data.video_id);
    }

    if (section.section_type === "clients" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.media_id) mediaIds.add(item.media_id);
      }
    }

    if (section.section_type === "about" && data.image_id) {
      mediaIds.add(data.image_id);
    }

    if (section.section_type === "track" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.media_id) mediaIds.add(item.media_id);
      }
    }

    if (section.section_type === "trusted_industries") {
      if (data.background_media_id) mediaIds.add(data.background_media_id);
      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item?.media_id) mediaIds.add(item.media_id);
        }
      }
    }

    if (section.section_type === "footprints" && data.dashboard_media_id) {
      mediaIds.add(data.dashboard_media_id);
    }

    if (section.section_type === "testimonials" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.media_id) mediaIds.add(item.media_id);
      }
    }

    if (section.section_type === "more_clients" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.media_id) mediaIds.add(item.media_id);
      }
    }

    if (section.section_type === "about_page_hero" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "who_we_are_about" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "our_journey_about" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.image_media_id) mediaIds.add(item.image_media_id);
      }
    }

    if (section.section_type === "what_we_deliver_about" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "reach_trust_about") {
      if (data.image_media_id) mediaIds.add(data.image_media_id);
      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item?.media_id) mediaIds.add(item.media_id);
        }
      }
    }
  }

  if (mediaIds.size === 0) return sections;

  const placeholders = [...mediaIds].map(() => "?").join(", ");
  const mediaResult = await pool.query(
    `SELECT id, file_url, alt_text, mime_type FROM media WHERE id IN (${placeholders})`,
    [...mediaIds]
  );

  const mediaMap = new Map(mediaResult.rows.map((row) => [row.id, row]));

  return sections.map((section) => {
    if (!section.data) return section;

    if (section.section_type === "hero") {
      const data = { ...section.data };

      if (data.image_id && mediaMap.has(data.image_id)) {
        const media = mediaMap.get(data.image_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text;
      }

      if (data.video_id && mediaMap.has(data.video_id)) {
        const media = mediaMap.get(data.video_id);
        data.video_url = absoluteAssetUrl(media.file_url, req);
      } else if (data.video_url?.startsWith("/uploads/")) {
        data.video_url = absoluteAssetUrl(data.video_url, req);
      }

      return { ...section, data };
    }

    if (section.section_type === "about") {
      const data = { ...section.data };

      if (data.image_id && mediaMap.has(data.image_id)) {
        const media = mediaMap.get(data.image_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text;
      }

      return { ...section, data };
    }

    if (section.section_type === "trusted_industries") {
      const data = { ...section.data };

      if (data.background_media_id && mediaMap.has(data.background_media_id)) {
        const media = mediaMap.get(data.background_media_id);
        data.background_image_url = absoluteAssetUrl(media.file_url, req);
      }

      if (Array.isArray(data.items)) {
        data.items = data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            image_url: absoluteAssetUrl(media.file_url, req),
            image_alt: media.alt_text || item.image_alt || item.name,
          };
        });
      }

      return { ...section, data };
    }

    if (section.section_type === "footprints") {
      const data = { ...section.data };

      if (data.dashboard_media_id && mediaMap.has(data.dashboard_media_id)) {
        const media = mediaMap.get(data.dashboard_media_id);
        data.dashboard_image_url = absoluteAssetUrl(media.file_url, req);
        data.dashboard_image_alt = media.alt_text || data.dashboard_image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "testimonials" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            company_logo_url: absoluteAssetUrl(media.file_url, req),
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "more_clients" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            logo_url: absoluteAssetUrl(media.file_url, req),
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "about_page_hero") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "who_we_are_about") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "our_journey_about" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.image_media_id || !mediaMap.has(item.image_media_id)) return item;
          const media = mediaMap.get(item.image_media_id);
          return {
            ...item,
            image_url: absoluteAssetUrl(media.file_url, req),
            image_alt: media.alt_text || item.image_alt,
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "what_we_deliver_about") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "reach_trust_about") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = absoluteAssetUrl(media.file_url, req);
        data.image_alt = media.alt_text || data.image_alt;
      }

      if (Array.isArray(data.items)) {
        data.items = data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            logo_url: absoluteAssetUrl(media.file_url, req),
          };
        });
      }

      return { ...section, data };
    }

    if (section.section_type === "track" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            image_url: absoluteAssetUrl(media.file_url, req),
            image_alt: media.alt_text || item.image_alt || item.title,
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "clients" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            logo_url: absoluteAssetUrl(media.file_url, req),
            alt: media.alt_text || item.name,
          };
        }),
      };
      return { ...section, data };
    }

    return section;
  });
}

async function sendPublicMegaMenu(req, res, menuKey, getSetting) {
  try {
    const menu = await getSetting();
    let resolved = resolveMenuLinks(menu, menuKey);
    resolved = await enrichMegaMenuFeaturedImage(resolved, req);
    res.json({ menu: resolved });
  } catch (error) {
    console.error("Public navigation error:", error);
    res.status(500).json({ error: "Failed to load navigation" });
  }
}

router.get("/navigation/resources", (req, res) =>
  sendPublicMegaMenu(req, res, RESOURCES_MEGA_MENU_KEY, getResourcesMegaMenuSetting)
);

router.get("/navigation/features", (req, res) =>
  sendPublicMegaMenu(req, res, FEATURES_MEGA_MENU_KEY, getFeaturesMegaMenuSetting)
);

router.get("/navigation/solutions", (req, res) =>
  sendPublicMegaMenu(req, res, SOLUTIONS_MEGA_MENU_KEY, getSolutionsMegaMenuSetting)
);

router.get("/pages/:slug", async (req, res) => {
  const slug = slugFromParam(req.params.slug);

  try {
    const pageResult = await pool.query(
      `SELECT id, title, slug, page_type, status, sort_order, updated_at
       FROM pages
       WHERE slug = ? AND status = 'published'`,
      [slug]
    );

    const page = pageResult.rows[0];
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const [sectionsResult, seoResult] = await Promise.all([
      pool.query(
        `SELECT id, section_type, position, is_active, data, updated_at
         FROM page_sections
         WHERE page_id = ? AND is_active = TRUE
         ORDER BY position ASC, created_at ASC`,
        [page.id]
      ),
      pool.query(`SELECT * FROM page_seo WHERE page_id = ?`, [page.id]),
    ]);

    let sections = sectionsResult.rows.map(parseSectionRow);
    sections = await enrichSectionsWithMedia(sections, req);

    res.json({
      page,
      sections,
      seo: seoResult.rows[0] ? parseSeoRow(seoResult.rows[0]) : null,
    });
  } catch (error) {
    console.error("Public page error:", error);
    res.status(500).json({ error: "Failed to load page" });
  }
});

export default router;
