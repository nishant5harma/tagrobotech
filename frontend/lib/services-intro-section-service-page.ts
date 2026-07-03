import defaults from "@/lib/data/services-intro-section-service-page.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type ServicesIntroButton = {
  text: string;
  link: string;
};

export type ServicesIntroFeaturedItem = {
  summary_label: string;
  title: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  link: string;
};

export type ServicesIntroProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ServicesIntroSectionServicePageData = {
  eyebrow: string;
  heading: string;
  description: string;
  primary_button: ServicesIntroButton;
  secondary_button: ServicesIntroButton;
  featured_items: ServicesIntroFeaturedItem[];
  process_steps: ServicesIntroProcessStep[];
};

export const DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE: ServicesIntroSectionServicePageData =
  defaults as ServicesIntroSectionServicePageData;

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

function asButton(value: unknown, fallback: ServicesIntroButton): ServicesIntroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeFeaturedItems(value: unknown): ServicesIntroFeaturedItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.featured_items.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.featured_items[index] ??
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.featured_items[0];

    return {
      summary_label: String(row.summary_label ?? fallback.summary_label),
      title: String(row.title ?? fallback.title),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_url: row.image_url ? String(row.image_url) : null,
      link: String(row.link ?? fallback.link),
    };
  });
}

function normalizeProcessSteps(value: unknown): ServicesIntroProcessStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.process_steps.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.process_steps[index] ??
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.process_steps[0];

    return {
      number: String(row.number ?? fallback.number),
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeServicesIntroSectionServicePageData(
  raw: unknown
): ServicesIntroSectionServicePageData {
  const data = asRecord(raw);

  return {
    eyebrow: String(data.eyebrow ?? DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.eyebrow),
    heading: String(data.heading ?? DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.heading),
    description: String(data.description ?? DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.description),
    primary_button: asButton(
      data.primary_button,
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.primary_button
    ),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE.secondary_button
    ),
    featured_items: normalizeFeaturedItems(data.featured_items),
    process_steps: normalizeProcessSteps(data.process_steps),
  };
}

export function servicesIntroSectionServicePageToPayload(
  data: ServicesIntroSectionServicePageData
): Record<string, unknown> {
  return { ...data };
}

export function mergeServicesIntroSectionServicePageData(
  cmsData: ServicesIntroSectionServicePageData | null
): ServicesIntroSectionServicePageData {
  if (!cmsData) return DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE;
  return normalizeServicesIntroSectionServicePageData(cmsData);
}

export function servicesIntroFeaturedImageSrc(item: ServicesIntroFeaturedItem): string {
  if (item.image_url) return resolveCmsMediaUrl(item.image_url);
  return item.image_src;
}
