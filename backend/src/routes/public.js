import { Router } from "express";
import crypto from "crypto";
import pool from "../db/pool.js";
import {
  FEATURES_MEGA_MENU_KEY,
  RESOURCES_MEGA_MENU_KEY,
  SOLUTIONS_MEGA_MENU_KEY,
  defaultFooterSettings,
  defaultSiteBrandingSettings,
  getFeaturesMegaMenuSetting,
  getFooterSetting,
  getResourcesMegaMenuSetting,
  getSiteBrandingSetting,
  getSolutionsMegaMenuSetting,
  enrichMegaMenuFeaturedImage,
  resolveMenuLinks,
} from "../lib/site-settings.js";
import { parseLeadRow, validateLeadInput } from "../lib/leads.js";
import { sendLeadNotificationEmail } from "../lib/email.js";

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

function parsePageRow(row) {
  if (!row) return row;
  return {
    ...row,
    published_at: row.published_at ?? null,
  };
}

function slugFromParam(param) {
  if (param === "home") return "/";
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

function siteAssetUrl(fileUrl) {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    try {
      const parsed = new URL(fileUrl);
      if (parsed.pathname.startsWith("/uploads/")) {
        return parsed.pathname;
      }
    } catch {
      return fileUrl;
    }
    return fileUrl;
  }
  return fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
}

function absoluteAssetUrl(fileUrl, req) {
  if (!fileUrl) return null;
  const relative = siteAssetUrl(fileUrl);
  if (relative.startsWith("http://") || relative.startsWith("https://")) return relative;
  const base = (process.env.PUBLIC_ASSET_URL || `${req.protocol}://${req.get("host")}`).replace(
    /\/$/,
    ""
  );
  return `${base}${relative}`;
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

    if (section.section_type === "page_hero") {
      if (data.desktop_image_media_id) mediaIds.add(data.desktop_image_media_id);
      if (data.mobile_image_media_id) mediaIds.add(data.mobile_image_media_id);
    }

    if (section.section_type === "hero_section_service_page" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "services_intro_section_service_page" && Array.isArray(data.featured_items)) {
      for (const item of data.featured_items) {
        if (item?.image_media_id) mediaIds.add(item.image_media_id);
      }
    }

    if (section.section_type === "services_catalogue_section_service_page" && Array.isArray(data.services)) {
      for (const item of data.services) {
        if (item?.image_media_id) mediaIds.add(item.image_media_id);
      }
    }

    if (section.section_type === "hero_section_tools" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "tools_intro_section_tools" && Array.isArray(data.tool_pills)) {
      for (const item of data.tool_pills) {
        if (item?.image_media_id) mediaIds.add(item.image_media_id);
      }
    }

    if (section.section_type === "tools_flagship_section_tools" && Array.isArray(data.tools)) {
      for (const item of data.tools) {
        if (item?.image_media_id) mediaIds.add(item.image_media_id);
      }
    }

    if (section.section_type === "hero_section_software" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "software_intro_section_software" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "software_modules_section_software" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "software_cta_section_software" && data.image_media_id) {
      mediaIds.add(data.image_media_id);
    }

    if (section.section_type === "page_clients" && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item?.media_id) mediaIds.add(item.media_id);
      }
    }

    if (section.section_type === "asset_management_solution" && Array.isArray(data.tabs)) {
      for (const tab of data.tabs) {
        if (tab?.image_media_id) mediaIds.add(tab.image_media_id);
      }
    }

    if (section.section_type === "article_body" && Array.isArray(data.embedded_media_ids)) {
      for (const mediaId of data.embedded_media_ids) {
        if (mediaId) mediaIds.add(mediaId);
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
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text;
      }

      if (data.video_id && mediaMap.has(data.video_id)) {
        const media = mediaMap.get(data.video_id);
        data.video_url = siteAssetUrl(media.file_url);
      } else if (data.video_url?.startsWith("/uploads/")) {
        data.video_url = siteAssetUrl(data.video_url);
      }

      return { ...section, data };
    }

    if (section.section_type === "about") {
      const data = { ...section.data };

      if (data.image_id && mediaMap.has(data.image_id)) {
        const media = mediaMap.get(data.image_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text;
      }

      return { ...section, data };
    }

    if (section.section_type === "trusted_industries") {
      const data = { ...section.data };

      if (data.background_media_id && mediaMap.has(data.background_media_id)) {
        const media = mediaMap.get(data.background_media_id);
        data.background_image_url = siteAssetUrl(media.file_url);
      }

      if (Array.isArray(data.items)) {
        data.items = data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            image_url: siteAssetUrl(media.file_url),
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
        data.dashboard_image_url = siteAssetUrl(media.file_url);
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
            company_logo_url: siteAssetUrl(media.file_url),
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
            logo_url: siteAssetUrl(media.file_url),
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "about_page_hero") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "who_we_are_about") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
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
            image_url: siteAssetUrl(media.file_url),
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
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "reach_trust_about") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }

      if (Array.isArray(data.items)) {
        data.items = data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            logo_url: siteAssetUrl(media.file_url),
          };
        });
      }

      return { ...section, data };
    }

    if (section.section_type === "page_hero") {
      const data = { ...section.data };

      if (data.desktop_image_media_id && mediaMap.has(data.desktop_image_media_id)) {
        const media = mediaMap.get(data.desktop_image_media_id);
        data.desktop_image_url = siteAssetUrl(media.file_url);
        data.desktop_image_alt = media.alt_text || data.desktop_image_alt;
      }

      if (data.mobile_image_media_id && mediaMap.has(data.mobile_image_media_id)) {
        const media = mediaMap.get(data.mobile_image_media_id);
        data.mobile_image_url = siteAssetUrl(media.file_url);
        data.mobile_image_alt = media.alt_text || data.mobile_image_alt;
      }

      return { ...section, data };
    }

    if (section.section_type === "hero_section_service_page") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (
      section.section_type === "services_intro_section_service_page" &&
      Array.isArray(section.data.featured_items)
    ) {
      const data = {
        ...section.data,
        featured_items: section.data.featured_items.map((item) => {
          if (!item?.image_media_id || !mediaMap.has(item.image_media_id)) return item;
          const media = mediaMap.get(item.image_media_id);
          return {
            ...item,
            image_url: siteAssetUrl(media.file_url),
            image_alt: media.alt_text || item.image_alt,
          };
        }),
      };
      return { ...section, data };
    }

    if (
      section.section_type === "services_catalogue_section_service_page" &&
      Array.isArray(section.data.services)
    ) {
      const data = {
        ...section.data,
        services: section.data.services.map((item) => {
          if (!item?.image_media_id || !mediaMap.has(item.image_media_id)) return item;
          const media = mediaMap.get(item.image_media_id);
          return {
            ...item,
            image_url: siteAssetUrl(media.file_url),
            image_alt: media.alt_text || item.image_alt,
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "hero_section_tools") {
      const data = { ...section.data };

      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }

      return { ...section, data };
    }

    if (
      section.section_type === "tools_intro_section_tools" &&
      Array.isArray(section.data.tool_pills)
    ) {
      const data = {
        ...section.data,
        tool_pills: section.data.tool_pills.map((item) => {
          if (!item?.image_media_id || !mediaMap.has(item.image_media_id)) return item;
          const media = mediaMap.get(item.image_media_id);
          return {
            ...item,
            image_url: siteAssetUrl(media.file_url),
            image_alt: media.alt_text || item.image_alt,
          };
        }),
      };
      return { ...section, data };
    }

    if (
      section.section_type === "tools_flagship_section_tools" &&
      Array.isArray(section.data.tools)
    ) {
      const data = {
        ...section.data,
        tools: section.data.tools.map((item) => {
          if (!item?.image_media_id || !mediaMap.has(item.image_media_id)) return item;
          const media = mediaMap.get(item.image_media_id);
          return {
            ...item,
            image_url: siteAssetUrl(media.file_url),
            image_alt: media.alt_text || item.image_alt,
          };
        }),
      };
      return { ...section, data };
    }

    if (section.section_type === "hero_section_software") {
      const data = { ...section.data };
      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }
      return { ...section, data };
    }

    if (section.section_type === "software_intro_section_software") {
      const data = { ...section.data };
      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }
      return { ...section, data };
    }

    if (section.section_type === "software_modules_section_software") {
      const data = { ...section.data };
      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }
      return { ...section, data };
    }

    if (section.section_type === "software_cta_section_software") {
      const data = { ...section.data };
      if (data.image_media_id && mediaMap.has(data.image_media_id)) {
        const media = mediaMap.get(data.image_media_id);
        data.image_url = siteAssetUrl(media.file_url);
        data.image_alt = media.alt_text || data.image_alt;
      }
      return { ...section, data };
    }

    if (section.section_type === "page_clients" && Array.isArray(section.data.items)) {
      const data = {
        ...section.data,
        items: section.data.items.map((item) => {
          if (!item?.media_id || !mediaMap.has(item.media_id)) return item;
          const media = mediaMap.get(item.media_id);
          return {
            ...item,
            logo_url: siteAssetUrl(media.file_url),
          };
        }),
      };
      return { ...section, data };
    }

    if (
      section.section_type === "asset_management_solution" &&
      Array.isArray(section.data.tabs)
    ) {
      const data = {
        ...section.data,
        tabs: section.data.tabs.map((tab) => {
          if (!tab?.image_media_id || !mediaMap.has(tab.image_media_id)) return tab;
          const media = mediaMap.get(tab.image_media_id);
          return {
            ...tab,
            image_url: siteAssetUrl(media.file_url),
            image_alt: media.alt_text || tab.image_alt,
          };
        }),
      };
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
            image_url: siteAssetUrl(media.file_url),
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
            logo_url: siteAssetUrl(media.file_url),
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

async function enrichMediaSetting(mediaId, req) {
  if (!mediaId) return null;
  const mediaResult = await pool.query(
    `SELECT id, file_url, alt_text, mime_type FROM media WHERE id = ?`,
    [mediaId]
  );
  const media = mediaResult.rows[0];
  if (!media) return null;

  return {
    id: media.id,
    url: siteAssetUrl(media.file_url),
    alt_text: media.alt_text || null,
    mime_type: media.mime_type || null,
  };
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

router.get("/settings/branding", async (req, res) => {
  try {
    const settings = {
      ...defaultSiteBrandingSettings(),
      ...(await getSiteBrandingSetting()),
    };
    const favicon = await enrichMediaSetting(settings.favicon_media_id, req);
    const navbarLogo = await enrichMediaSetting(settings.navbar_logo_media_id, req);
    res.json({
      settings: {
        ...settings,
        favicon_url: favicon?.url ?? null,
        favicon_alt: favicon?.alt_text ?? settings.site_name,
        navbar_logo_url: navbarLogo?.url ?? null,
        navbar_logo_alt: navbarLogo?.alt_text ?? settings.site_name,
      },
    });
  } catch (error) {
    console.error("Public branding settings error:", error);
    res.status(500).json({ error: "Failed to load branding settings" });
  }
});

router.get("/settings/footer", async (req, res) => {
  try {
    const settings = {
      ...defaultFooterSettings(),
      ...(await getFooterSetting()),
    };
    const logo = await enrichMediaSetting(settings.logo_media_id, req);
    res.json({
      settings: {
        ...settings,
        logo_url: logo?.url ?? null,
        logo_alt: logo?.alt_text ?? "Tag RoBo Tech",
      },
    });
  } catch (error) {
    console.error("Public footer settings error:", error);
    res.status(500).json({ error: "Failed to load footer settings" });
  }
});

router.get("/pages/:slug", async (req, res) => {
  const slug = slugFromParam(req.params.slug);

  try {
    const pageResult = await pool.query(
      `SELECT id, title, slug, page_type, status, excerpt, featured_image_id, published_at,
              author_name, client_name, industry, sort_order, updated_at
       FROM pages
       WHERE slug = ? AND status = 'published'`,
      [slug]
    );

    const page = parsePageRow(pageResult.rows[0]);
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

    const seo = seoResult.rows[0] ? parseSeoRow(seoResult.rows[0]) : null;

    if (page.featured_image_id) {
      const featuredImageResult = await pool.query(
        `SELECT id, file_url, alt_text, mime_type FROM media WHERE id = ?`,
        [page.featured_image_id]
      );
      const featuredImage = featuredImageResult.rows[0];
      if (featuredImage) {
        page.featured_image_url = absoluteAssetUrl(featuredImage.file_url, req);
        page.featured_image_alt = featuredImage.alt_text || page.title;
      }
    }

    if (seo?.og_image_id) {
      const ogImageResult = await pool.query(
        `SELECT id, file_url, alt_text FROM media WHERE id = ?`,
        [seo.og_image_id]
      );
      const ogImage = ogImageResult.rows[0];
      if (ogImage) {
        seo.og_image_url = absoluteAssetUrl(ogImage.file_url, req);
        seo.og_image_alt = ogImage.alt_text || page.title;
      }
    }

    res.json({
      page,
      sections,
      seo,
    });
  } catch (error) {
    console.error("Public page error:", error);
    res.status(500).json({ error: "Failed to load page" });
  }
});

router.get("/content/:pageType", async (req, res) => {
  const pageType = String(req.params.pageType ?? "").trim();
  const limit = Math.min(Math.max(Number(req.query.limit ?? 12), 1), 50);
  const offset = Math.max(Number(req.query.offset ?? 0), 0);
  const allowedTypes = new Set(["blog", "case_study"]);

  if (!allowedTypes.has(pageType)) {
    return res.status(400).json({ error: "Unsupported content type" });
  }

  try {
    const result = await pool.query(
      `SELECT id, title, slug, page_type, status, excerpt, featured_image_id, published_at,
              author_name, client_name, industry, updated_at
       FROM pages
       WHERE page_type = ? AND status = 'published'
       ORDER BY COALESCE(published_at, updated_at) DESC, updated_at DESC
       LIMIT ? OFFSET ?`,
      [pageType, limit, offset]
    );

    const rows = result.rows.map(parsePageRow);
    const mediaIds = rows.map((row) => row.featured_image_id).filter(Boolean);
    const mediaMap = new Map();

    if (mediaIds.length > 0) {
      const placeholders = mediaIds.map(() => "?").join(", ");
      const mediaResult = await pool.query(
        `SELECT id, file_url, alt_text FROM media WHERE id IN (${placeholders})`,
        mediaIds
      );
      for (const media of mediaResult.rows) {
        mediaMap.set(media.id, media);
      }
    }

    const items = rows.map((row) => {
      const featuredImage = row.featured_image_id ? mediaMap.get(row.featured_image_id) : null;

      return {
        ...row,
        featured_image_url: featuredImage ? absoluteAssetUrl(featuredImage.file_url, req) : null,
        featured_image_alt: featuredImage?.alt_text || row.title,
      };
    });

    res.json({ items });
  } catch (error) {
    console.error("Public content list error:", error);
    res.status(500).json({ error: "Failed to load content list" });
  }
});

router.post("/leads", async (req, res) => {
  const validation = validateLeadInput(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const lead = validation.data;
  const leadId = crypto.randomUUID();
  const referer = sanitizeLeadReferer(req.get("referer"));

  try {
    await pool.query(
      `INSERT INTO leads (
        id, form_type, name, email, phone, message, source_page, source_label, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        leadId,
        lead.form_type,
        lead.name,
        lead.email,
        lead.phone,
        lead.message,
        lead.source_page ?? referer,
        lead.source_label,
      ]
    );

    const result = await pool.query(
      `SELECT id, form_type, name, email, phone, message, source_page, source_label, status, metadata, created_at, updated_at
       FROM leads WHERE id = ?`,
      [leadId]
    );

    const savedLead = parseLeadRow(result.rows[0]);

    sendLeadNotificationEmail(savedLead)
      .then((result) => {
        if (!result.sent) {
          console.warn("Lead notification email was not sent:", result.reason);
        }
      })
      .catch((emailError) => {
        console.error("Lead notification email failed:", emailError);
      });

    res.status(201).json({
      message: "Thank you! We will get back to you shortly.",
      lead: savedLead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

function sanitizeLeadReferer(referer) {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return `${url.pathname}${url.search}`.slice(0, 255);
  } catch {
    return String(referer).slice(0, 255);
  }
}

export default router;
