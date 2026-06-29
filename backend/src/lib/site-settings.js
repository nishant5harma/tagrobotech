import pool from "../db/pool.js";
import { defaultResourcesMegaMenuData } from "./resources-mega-menu-defaults.js";
import { defaultFeaturesMegaMenuData } from "./features-mega-menu-defaults.js";
import { defaultSolutionsMegaMenuData } from "./solutions-mega-menu-defaults.js";

export const RESOURCES_MEGA_MENU_KEY = "resources_mega_menu";
export const FEATURES_MEGA_MENU_KEY = "features_mega_menu";
export const SOLUTIONS_MEGA_MENU_KEY = "solutions_mega_menu";

const MENU_DEFAULTS = {
  [RESOURCES_MEGA_MENU_KEY]: defaultResourcesMegaMenuData,
  [FEATURES_MEGA_MENU_KEY]: defaultFeaturesMegaMenuData,
  [SOLUTIONS_MEGA_MENU_KEY]: defaultSolutionsMegaMenuData,
};

const MENU_LINK_PREFIX = {
  [RESOURCES_MEGA_MENU_KEY]: "/resources",
  [FEATURES_MEGA_MENU_KEY]: "/features",
  [SOLUTIONS_MEGA_MENU_KEY]: "/solutions",
};

function parseJsonValue(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value ?? null;
}

export async function getSiteSetting(key, fallback = null) {
  const result = await pool.query(
    `SELECT setting_value FROM site_settings WHERE setting_key = ?`,
    [key]
  );

  if (result.rows.length === 0) return fallback;

  return parseJsonValue(result.rows[0].setting_value) ?? fallback;
}

export async function setSiteSetting(key, value) {
  const json = JSON.stringify(value);

  await pool.query(
    `INSERT INTO site_settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [key, json]
  );
}

export async function getMegaMenuSetting(key) {
  const fallback = MENU_DEFAULTS[key]?.() ?? null;
  return getSiteSetting(key, fallback);
}

export async function setMegaMenuSetting(key, value) {
  return setSiteSetting(key, value);
}

export async function getResourcesMegaMenuSetting() {
  return getMegaMenuSetting(RESOURCES_MEGA_MENU_KEY);
}

export async function setResourcesMegaMenuSetting(value) {
  return setMegaMenuSetting(RESOURCES_MEGA_MENU_KEY, value);
}

export async function getFeaturesMegaMenuSetting() {
  return getMegaMenuSetting(FEATURES_MEGA_MENU_KEY);
}

export async function setFeaturesMegaMenuSetting(value) {
  return setMegaMenuSetting(FEATURES_MEGA_MENU_KEY, value);
}

export async function getSolutionsMegaMenuSetting() {
  return getMegaMenuSetting(SOLUTIONS_MEGA_MENU_KEY);
}

export async function setSolutionsMegaMenuSetting(value) {
  return setMegaMenuSetting(SOLUTIONS_MEGA_MENU_KEY, value);
}

export function resolveMenuItemHref(item, linkPrefix = "/resources") {
  if (item?.href?.trim()) return item.href.trim();
  if (item?.page_slug?.trim()) return `${linkPrefix}/${item.page_slug.trim()}`;
  return "#";
}

export function resolveMenuLinks(menu, menuKey = RESOURCES_MEGA_MENU_KEY) {
  const linkPrefix = MENU_LINK_PREFIX[menuKey] ?? "/resources";

  const featuredHref = menu.featured?.href?.trim()
    ? menu.featured.href.trim()
    : menu.featured?.page_slug?.trim()
      ? `${linkPrefix}/${menu.featured.page_slug.trim()}`
      : "#";

  return {
    ...menu,
    featured: {
      ...menu.featured,
      href: featuredHref,
    },
    columns: (menu.columns ?? []).map((column) => ({
      ...column,
      items: (column.items ?? []).map((item) => ({
        ...item,
        href: resolveMenuItemHref(item, linkPrefix),
      })),
    })),
  };
}

export async function enrichMegaMenuFeaturedImage(menu, req) {
  if (!menu?.featured?.image_media_id) return menu;

  const mediaResult = await pool.query(
    `SELECT file_url, alt_text FROM media WHERE id = ?`,
    [menu.featured.image_media_id]
  );
  const media = mediaResult.rows[0];
  if (!media) return menu;

  const base = process.env.PUBLIC_ASSET_URL || `${req.protocol}://${req.get("host")}`;
  const fileUrl = media.file_url;
  const imageUrl =
    fileUrl.startsWith("http://") || fileUrl.startsWith("https://")
      ? fileUrl
      : `${base}${fileUrl}`;

  return {
    ...menu,
    featured: {
      ...menu.featured,
      image_url: imageUrl,
      image_alt: media.alt_text || menu.featured.title,
    },
  };
}
