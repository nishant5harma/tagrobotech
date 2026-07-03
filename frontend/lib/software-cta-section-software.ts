import defaults from "@/lib/data/software-cta-section-software.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type SoftwareCtaButton = { text: string; link: string };

export type SoftwareCtaSectionSoftwareData = {
  tagline: string;
  heading: string;
  description: string;
  primary_button: SoftwareCtaButton;
  secondary_button: SoftwareCtaButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
};

export const DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE: SoftwareCtaSectionSoftwareData =
  defaults as SoftwareCtaSectionSoftwareData;

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

function asButton(value: unknown, fallback: SoftwareCtaButton): SoftwareCtaButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return { text: String(row.text ?? fallback.text), link: String(row.link ?? fallback.link) };
}

export function normalizeSoftwareCtaSectionSoftwareData(
  raw: unknown
): SoftwareCtaSectionSoftwareData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.tagline),
    heading: String(data.heading ?? DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.heading),
    description: String(data.description ?? DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.description),
    primary_button: asButton(data.primary_button, DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.secondary_button
    ),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE.image_alt),
    image_url: data.image_url ? String(data.image_url) : null,
  };
}

export function mergeSoftwareCtaSectionSoftwareData(
  cmsData: SoftwareCtaSectionSoftwareData | null
): SoftwareCtaSectionSoftwareData {
  if (!cmsData) return DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE;
  return normalizeSoftwareCtaSectionSoftwareData(cmsData);
}

export function softwareCtaImageSrc(section: SoftwareCtaSectionSoftwareData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}

export function softwareCtaSectionSoftwareToPayload(
  data: SoftwareCtaSectionSoftwareData
): Record<string, unknown> {
  return { ...data };
}
