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

export const MEGA_MENU_DEFAULTS = {
  resources: resourcesDefaults as MegaMenuData,
  features: featuresDefaults as MegaMenuData,
  solutions: solutionsDefaults as MegaMenuData,
};

export type MegaMenuKind = keyof typeof MEGA_MENU_DEFAULTS;

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

function asLinkItems(value: unknown, fallback: MegaMenuLinkItem[] = []): MegaMenuLinkItem[] {
  if (!Array.isArray(value) || value.length === 0) return [...fallback];

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fb = fallback[index] ?? { label: "", page_slug: null, href: null };

    return {
      label: String(row.label ?? fb.label),
      page_slug: row.page_slug ? String(row.page_slug) : null,
      href: row.href ? String(row.href) : null,
    };
  });
}

function asColumns(value: unknown, fallback: MegaMenuColumn[]): MegaMenuColumn[] {
  if (!Array.isArray(value) || value.length === 0) return [...fallback];

  return value.map((column, index) => {
    const row = (column ?? {}) as Record<string, unknown>;
    const fb = fallback[index] ?? { title: "", subtitle: "", items: [] };

    return {
      title: String(row.title ?? fb.title),
      subtitle: String(row.subtitle ?? fb.subtitle),
      items: asLinkItems(row.items, fb.items),
    };
  });
}

function asFeatured(value: unknown, fallback: MegaMenuFeatured): MegaMenuFeatured {
  const row = (value ?? {}) as Record<string, unknown>;

  return {
    tagline: String(row.tagline ?? fallback.tagline),
    title: String(row.title ?? fallback.title),
    image_media_id: row.image_media_id ? String(row.image_media_id) : null,
    image_src: String(row.image_src ?? fallback.image_src),
    page_slug: row.page_slug ? String(row.page_slug) : null,
    href: row.href ? String(row.href) : null,
  };
}

export function normalizeMegaMenuData(raw: unknown, kind: MegaMenuKind): MegaMenuData {
  const defaults = MEGA_MENU_DEFAULTS[kind];
  const data = asRecord(raw);

  return {
    label: String(data.label ?? defaults.label),
    intro_tagline: String(data.intro_tagline ?? defaults.intro_tagline),
    intro_description: String(data.intro_description ?? defaults.intro_description),
    featured: asFeatured(data.featured, defaults.featured),
    columns: asColumns(data.columns, defaults.columns),
  };
}

export function megaMenuToPayload(data: MegaMenuData): Record<string, unknown> {
  return { ...data };
}

// Back-compat aliases
export type ResourcesMegaMenuData = MegaMenuData;
export const normalizeResourcesMegaMenuData = (raw: unknown) =>
  normalizeMegaMenuData(raw, "resources");
export const resourcesMegaMenuToPayload = megaMenuToPayload;
