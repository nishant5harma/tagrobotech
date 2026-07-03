import pageHeroDefaults from "@/lib/data/page-hero.json";

export type PageHeroBreadcrumb = {
  label: string;
  href: string | null;
};

export type PageHeroButton = {
  text: string;
  link: string;
};

export type PageHeroStat = {
  value: string;
  label: string;
};

export type PageHeroSectionData = {
  breadcrumbs: PageHeroBreadcrumb[];
  heading: string;
  description: string;
  primary_button: PageHeroButton;
  secondary_button: PageHeroButton;
  stats: PageHeroStat[];
  desktop_image_media_id: string | null;
  desktop_image_src: string;
  desktop_image_alt: string;
  mobile_image_media_id: string | null;
  mobile_image_src: string;
  mobile_image_alt: string;
};

export const DEFAULT_PAGE_HERO_SECTION: PageHeroSectionData =
  pageHeroDefaults as PageHeroSectionData;

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

function normalizeBreadcrumbs(value: unknown): PageHeroBreadcrumb[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PAGE_HERO_SECTION.breadcrumbs.map((item) => ({ ...item }));
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(row.label ?? ""),
      href: row.href ? String(row.href) : null,
    };
  });
}

function normalizeButton(value: unknown, fallback: PageHeroButton): PageHeroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeStats(value: unknown): PageHeroStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PAGE_HERO_SECTION.stats.map((item) => ({ ...item }));
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      value: String(row.value ?? ""),
      label: String(row.label ?? ""),
    };
  });
}

export function normalizePageHeroSectionData(raw: unknown): PageHeroSectionData {
  const data = asRecord(raw);

  return {
    breadcrumbs: normalizeBreadcrumbs(data.breadcrumbs),
    heading: String(data.heading ?? DEFAULT_PAGE_HERO_SECTION.heading),
    description: String(data.description ?? DEFAULT_PAGE_HERO_SECTION.description),
    primary_button: normalizeButton(
      data.primary_button,
      DEFAULT_PAGE_HERO_SECTION.primary_button
    ),
    secondary_button: normalizeButton(
      data.secondary_button,
      DEFAULT_PAGE_HERO_SECTION.secondary_button
    ),
    stats: normalizeStats(data.stats),
    desktop_image_media_id: data.desktop_image_media_id
      ? String(data.desktop_image_media_id)
      : null,
    desktop_image_src: String(
      data.desktop_image_src ?? DEFAULT_PAGE_HERO_SECTION.desktop_image_src
    ),
    desktop_image_alt: String(
      data.desktop_image_alt ?? DEFAULT_PAGE_HERO_SECTION.desktop_image_alt
    ),
    mobile_image_media_id: data.mobile_image_media_id
      ? String(data.mobile_image_media_id)
      : null,
    mobile_image_src: String(
      data.mobile_image_src ?? DEFAULT_PAGE_HERO_SECTION.mobile_image_src
    ),
    mobile_image_alt: String(
      data.mobile_image_alt ?? DEFAULT_PAGE_HERO_SECTION.mobile_image_alt
    ),
  };
}

export function pageHeroSectionToPayload(data: PageHeroSectionData): Record<string, unknown> {
  return { ...data };
}
