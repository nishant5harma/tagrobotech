import pool from "../db/pool.js";
import { defaultResourcesMegaMenuData } from "./resources-mega-menu-defaults.js";
import { defaultFeaturesMegaMenuData } from "./features-mega-menu-defaults.js";
import { defaultSolutionsMegaMenuData } from "./solutions-mega-menu-defaults.js";

export const RESOURCES_MEGA_MENU_KEY = "resources_mega_menu";
export const FEATURES_MEGA_MENU_KEY = "features_mega_menu";
export const SOLUTIONS_MEGA_MENU_KEY = "solutions_mega_menu";
export const SITE_BRANDING_KEY = "site_branding";
export const FOOTER_SETTINGS_KEY = "footer_settings";

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

export function defaultSiteBrandingSettings() {
  return {
    site_name: "Tag RoBo Tech",
    default_title: "Tag RoBo Tech | Pioneers of Enterprise Asset Tracking",
    default_description:
      "Tag RoBo Tech pioneered enterprise asset tracking in India — RFID, IoT, BLE, and robotics solutions for assets, inventory, fleet, and more.",
    favicon_media_id: null,
  };
}

export function defaultFooterSettings() {
  return {
    logo_media_id: null,
    about_text:
      "We have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc. almost everything that needs to be tracked!",
    quick_links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Products", href: "/services" },
      { label: "Services", href: "/services" },
      { label: "Clients", href: "/clients" },
      { label: "Blogs", href: "/#blogs" },
    ],
    support_links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/contact#faqs" },
      { label: "Customer Support", href: "/contact" },
      { label: "How it Works", href: "/services" },
      { label: "Terms & Conditions", href: "/contact#terms" },
    ],
    legal_links: [
      { label: "Privacy Policy", href: "/contact#privacy" },
      { label: "Terms of Use", href: "/contact#terms" },
    ],
    social_links: [
      { label: "Facebook", href: "https://www.facebook.com/tagrobotechllp" },
      { label: "Instagram", href: "https://www.instagram.com/tagrobotechllp/" },
      { label: "X", href: "https://x.com/tagrobotechllp" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/tag-robo-tech-official-llp/" },
    ],
    contact: {
      head_office: "Suncity Success Tower, Sector-65, Gurugram — 122018",
      rnd_centre: "198, Udyog Vihar, Phase IV — Gurgaon — 122015",
      email: "info@tagrobotech.com",
      sales_phone: "9319013339",
      partner_phone: "9818883697",
    },
  };
}

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

export async function getSiteBrandingSetting() {
  return getSiteSetting(SITE_BRANDING_KEY, defaultSiteBrandingSettings());
}

export async function setSiteBrandingSetting(value) {
  return setSiteSetting(SITE_BRANDING_KEY, value);
}

export async function getFooterSetting() {
  return getSiteSetting(FOOTER_SETTINGS_KEY, defaultFooterSettings());
}

export async function setFooterSetting(value) {
  return setSiteSetting(FOOTER_SETTINGS_KEY, value);
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
