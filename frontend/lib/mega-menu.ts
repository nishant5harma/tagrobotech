import resourcesDefaults from "@/lib/data/resources-mega-menu.json";
import featuresDefaults from "@/lib/data/features-mega-menu.json";
import solutionsDefaults from "@/lib/data/solutions-mega-menu.json";

export type MegaMenuLinkItem = {
  label: string;
  page_slug: string | null;
  href: string | null;
};

export type MegaMenuColumn = {
  title: string;
  subtitle: string;
  items: MegaMenuLinkItem[];
};

export type MegaMenuFeatured = {
  tagline: string;
  title: string;
  image_media_id: string | null;
  image_src: string;
  image_url?: string | null;
  image_alt?: string | null;
  page_slug: string | null;
  href: string | null;
};

export type MegaMenuData = {
  label: string;
  intro_tagline: string;
  intro_description: string;
  featured: MegaMenuFeatured;
  columns: MegaMenuColumn[];
};

export type MegaMenuKind = "resources" | "features" | "solutions";

export const MEGA_MENU_LINK_PREFIX: Record<MegaMenuKind, string> = {
  resources: "/resources",
  features: "/features",
  solutions: "/solutions",
};

const RAW_DEFAULTS: Record<MegaMenuKind, MegaMenuData> = {
  resources: resourcesDefaults as MegaMenuData,
  features: featuresDefaults as MegaMenuData,
  solutions: solutionsDefaults as MegaMenuData,
};

function asRecord(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) ?? {};
}

function resolveItemHref(item: MegaMenuLinkItem, linkPrefix: string): string {
  if (item.href?.trim()) return item.href.trim();
  if (item.page_slug?.trim()) return `${linkPrefix}/${item.page_slug.trim()}`;
  return "#";
}

function asLinkItems(
  value: unknown,
  fallback: MegaMenuLinkItem[],
  linkPrefix: string
): MegaMenuLinkItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => ({ ...item, href: resolveItemHref(item, linkPrefix) }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fb = fallback[index] ?? { label: "", page_slug: null, href: null };
    const parsed: MegaMenuLinkItem = {
      label: String(row.label ?? fb.label),
      page_slug: row.page_slug ? String(row.page_slug) : null,
      href: row.href ? String(row.href) : null,
    };
    return { ...parsed, href: String(row.href ?? resolveItemHref(parsed, linkPrefix)) };
  });
}

function asColumns(value: unknown, fallback: MegaMenuColumn[], linkPrefix: string): MegaMenuColumn[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((column) => ({
      ...column,
      items: column.items.map((item) => ({ ...item, href: resolveItemHref(item, linkPrefix) })),
    }));
  }

  return value.map((column, index) => {
    const row = (column ?? {}) as Record<string, unknown>;
    const fb = fallback[index] ?? { title: "", subtitle: "", items: [] };

    return {
      title: String(row.title ?? fb.title),
      subtitle: String(row.subtitle ?? fb.subtitle),
      items: asLinkItems(row.items, fb.items, linkPrefix),
    };
  });
}

function asFeatured(value: unknown, fallback: MegaMenuFeatured, linkPrefix: string): MegaMenuFeatured {
  const row = (value ?? {}) as Record<string, unknown>;

  const parsed: MegaMenuFeatured = {
    tagline: String(row.tagline ?? fallback.tagline),
    title: String(row.title ?? fallback.title),
    image_media_id: row.image_media_id ? String(row.image_media_id) : null,
    image_src: String(row.image_src ?? fallback.image_src),
    image_url: row.image_url ? String(row.image_url) : null,
    image_alt: row.image_alt ? String(row.image_alt) : null,
    page_slug: row.page_slug ? String(row.page_slug) : null,
    href: row.href ? String(row.href) : null,
  };

  const href = parsed.href?.trim() && parsed.href !== "#"
    ? parsed.href.trim()
    : parsed.page_slug?.trim()
      ? `${linkPrefix}/${parsed.page_slug.trim()}`
      : "#";

  return { ...parsed, href };
}

export function normalizeMegaMenuData(raw: unknown, kind: MegaMenuKind): MegaMenuData {
  const defaults = RAW_DEFAULTS[kind];
  const linkPrefix = MEGA_MENU_LINK_PREFIX[kind];
  const data = asRecord(raw);

  return {
    label: String(data.label ?? defaults.label),
    intro_tagline: String(data.intro_tagline ?? defaults.intro_tagline),
    intro_description: String(data.intro_description ?? defaults.intro_description),
    featured: asFeatured(data.featured, defaults.featured, linkPrefix),
    columns: asColumns(data.columns, defaults.columns, linkPrefix),
  };
}

export function mergeMegaMenuData(cmsData: MegaMenuData | null, kind: MegaMenuKind): MegaMenuData {
  if (!cmsData) return normalizeMegaMenuData(null, kind);
  return normalizeMegaMenuData(cmsData, kind);
}

export function featuredImageSrc(featured: MegaMenuFeatured): string {
  if (featured.image_url) {
    const base = process.env.NEXT_PUBLIC_CMS_API_URL ?? "";
    if (featured.image_url.startsWith("http")) return featured.image_url;
    return `${base}${featured.image_url}`;
  }
  return featured.image_src;
}

export type ResourcesMegaMenuData = MegaMenuData;
export const normalizeResourcesMegaMenuData = (raw: unknown) =>
  normalizeMegaMenuData(raw, "resources");
export const mergeResourcesMegaMenuData = (data: MegaMenuData | null) =>
  mergeMegaMenuData(data, "resources");
