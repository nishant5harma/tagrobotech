import pageHeroSimpleDefaults from "@/lib/data/page-hero-simple.json";

export type PageHeroSimpleBreadcrumb = {
  label: string;
  href: string | null;
};

export type PageHeroSimpleButton = {
  text: string;
  link: string;
};

export type PageHeroSimpleStat = {
  value: string;
  label: string;
};

export type PageHeroSimpleSectionData = {
  breadcrumbs: PageHeroSimpleBreadcrumb[];
  heading: string;
  description: string;
  primary_button: PageHeroSimpleButton;
  secondary_button: PageHeroSimpleButton;
  stats: PageHeroSimpleStat[];
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
};

export const DEFAULT_PAGE_HERO_SIMPLE_SECTION: PageHeroSimpleSectionData =
  pageHeroSimpleDefaults as PageHeroSimpleSectionData;

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

function normalizeButton(
  value: unknown,
  fallback: PageHeroSimpleButton
): PageHeroSimpleButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeBreadcrumbs(value: unknown): PageHeroSimpleBreadcrumb[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PAGE_HERO_SIMPLE_SECTION.breadcrumbs.map((item) => ({ ...item }));
  }
  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(row.label ?? ""),
      href: row.href ? String(row.href) : null,
    };
  });
}

function normalizeStats(value: unknown): PageHeroSimpleStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PAGE_HERO_SIMPLE_SECTION.stats.map((item) => ({ ...item }));
  }
  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      value: String(row.value ?? ""),
      label: String(row.label ?? ""),
    };
  });
}

export function normalizePageHeroSimpleSectionData(raw: unknown): PageHeroSimpleSectionData {
  const data = asRecord(raw);
  return {
    breadcrumbs: normalizeBreadcrumbs(data.breadcrumbs),
    heading: String(data.heading ?? DEFAULT_PAGE_HERO_SIMPLE_SECTION.heading),
    description: String(data.description ?? DEFAULT_PAGE_HERO_SIMPLE_SECTION.description),
    primary_button: normalizeButton(
      data.primary_button,
      DEFAULT_PAGE_HERO_SIMPLE_SECTION.primary_button
    ),
    secondary_button: normalizeButton(
      data.secondary_button,
      DEFAULT_PAGE_HERO_SIMPLE_SECTION.secondary_button
    ),
    stats: normalizeStats(data.stats),
    image_media_id: (data.image_media_id as string | null) ?? null,
    image_src: String(data.image_src ?? DEFAULT_PAGE_HERO_SIMPLE_SECTION.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_PAGE_HERO_SIMPLE_SECTION.image_alt),
    image_url: (data.image_url as string | null | undefined) ?? null,
  };
}

export function pageHeroSimpleSectionToPayload(
  data: PageHeroSimpleSectionData
): Record<string, unknown> {
  return {
    breadcrumbs: data.breadcrumbs,
    heading: data.heading,
    description: data.description,
    primary_button: data.primary_button,
    secondary_button: data.secondary_button,
    stats: data.stats,
    image_media_id: data.image_media_id,
    image_src: data.image_src,
    image_alt: data.image_alt,
  };
}
