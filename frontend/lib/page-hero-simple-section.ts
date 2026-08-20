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

export type PageHeroSimpleContext = {
  pageType?: string;
  pageTitle?: string;
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

function normalizeBreadcrumbs(
  value: unknown,
  context?: PageHeroSimpleContext
): PageHeroSimpleBreadcrumb[] {
  if (!Array.isArray(value) || value.length === 0) {
    const defaults = DEFAULT_PAGE_HERO_SIMPLE_SECTION.breadcrumbs.map((item) => ({ ...item }));
    if (context?.pageTitle && defaults.length > 0) {
      defaults[defaults.length - 1] = {
        label: context.pageTitle,
        href: null,
      };
    }
    return defaults;
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

export function normalizePageHeroSimpleSectionData(
  raw: unknown,
  context?: PageHeroSimpleContext
): PageHeroSimpleSectionData {
  const data = asRecord(raw);
  return {
    breadcrumbs: normalizeBreadcrumbs(data.breadcrumbs, context),
    heading: String(data.heading ?? context?.pageTitle ?? DEFAULT_PAGE_HERO_SIMPLE_SECTION.heading),
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

export function mergePageHeroSimpleSectionData(
  cmsData: PageHeroSimpleSectionData | null | undefined,
  context?: PageHeroSimpleContext
): PageHeroSimpleSectionData {
  if (!cmsData) return normalizePageHeroSimpleSectionData({}, context);
  return normalizePageHeroSimpleSectionData(cmsData, context);
}

export function pageHeroSimpleImageSrc(src: string, url?: string | null) {
  return url || src || "/uploads/tagrobotech.png";
}
