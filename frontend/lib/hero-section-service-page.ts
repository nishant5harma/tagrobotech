import defaults from "@/lib/data/hero-section-service-page.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type HeroSectionServicePageButton = {
  text: string;
  link: string;
};

export type HeroSectionServicePageData = {
  tagline: string;
  heading: string;
  description: string;
  phone_label: string;
  phone_number: string;
  primary_button: HeroSectionServicePageButton;
  secondary_button: HeroSectionServicePageButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
};

export const DEFAULT_HERO_SECTION_SERVICE_PAGE: HeroSectionServicePageData =
  defaults as HeroSectionServicePageData;

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

function asButton(value: unknown, fallback: HeroSectionServicePageButton): HeroSectionServicePageButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizeHeroSectionServicePageData(raw: unknown): HeroSectionServicePageData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.tagline),
    heading: String(data.heading ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.heading),
    description: String(data.description ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.description),
    phone_label: String(data.phone_label ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.phone_label),
    phone_number: String(data.phone_number ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.phone_number),
    primary_button: asButton(data.primary_button, DEFAULT_HERO_SECTION_SERVICE_PAGE.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_HERO_SECTION_SERVICE_PAGE.secondary_button
    ),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_HERO_SECTION_SERVICE_PAGE.image_alt),
    image_url: data.image_url ? String(data.image_url) : null,
  };
}

export function mergeHeroSectionServicePageData(
  cmsData: HeroSectionServicePageData | null
): HeroSectionServicePageData {
  if (!cmsData) return DEFAULT_HERO_SECTION_SERVICE_PAGE;
  return normalizeHeroSectionServicePageData(cmsData);
}

export function heroSectionServicePageImageSrc(section: HeroSectionServicePageData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}

export function heroSectionServicePageToPayload(
  data: HeroSectionServicePageData
): Record<string, unknown> {
  return { ...data };
}
