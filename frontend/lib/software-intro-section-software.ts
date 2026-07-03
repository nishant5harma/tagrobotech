import defaults from "@/lib/data/software-intro-section-software.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type SoftwareIntroButton = { text: string; link: string };
export type SoftwareIntroBadge = { label: string };
export type SoftwareIntroValueProp = { number: string; title: string; description: string };

export type SoftwareIntroSectionSoftwareData = {
  eyebrow: string;
  heading: string;
  description: string;
  badges: SoftwareIntroBadge[];
  primary_button: SoftwareIntroButton;
  secondary_button: SoftwareIntroButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  value_props: SoftwareIntroValueProp[];
};

export const DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE: SoftwareIntroSectionSoftwareData =
  defaults as SoftwareIntroSectionSoftwareData;

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

function asButton(value: unknown, fallback: SoftwareIntroButton): SoftwareIntroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return { text: String(row.text ?? fallback.text), link: String(row.link ?? fallback.link) };
}

function normalizeBadges(value: unknown): SoftwareIntroBadge[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.badges.map((item) => ({ ...item }));
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.badges[index] ?? { label: "" };
    return { label: String(row.label ?? fallback.label) };
  });
}

function normalizeValueProps(value: unknown): SoftwareIntroValueProp[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.value_props.map((item) => ({ ...item }));
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.value_props[index] ??
      DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.value_props[0];
    return {
      number: String(row.number ?? fallback.number),
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeSoftwareIntroSectionSoftwareData(
  raw: unknown
): SoftwareIntroSectionSoftwareData {
  const data = asRecord(raw);
  return {
    eyebrow: String(data.eyebrow ?? DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.eyebrow),
    heading: String(data.heading ?? DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.heading),
    description: String(data.description ?? DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.description),
    badges: normalizeBadges(data.badges),
    primary_button: asButton(data.primary_button, DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.secondary_button
    ),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE.image_alt),
    image_url: data.image_url ? String(data.image_url) : null,
    value_props: normalizeValueProps(data.value_props),
  };
}

export function softwareIntroSectionSoftwareToPayload(
  data: SoftwareIntroSectionSoftwareData
): Record<string, unknown> {
  return { ...data };
}

export function mergeSoftwareIntroSectionSoftwareData(
  cmsData: SoftwareIntroSectionSoftwareData | null
): SoftwareIntroSectionSoftwareData {
  if (!cmsData) return DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE;
  return normalizeSoftwareIntroSectionSoftwareData(cmsData);
}

export function softwareIntroImageSrc(section: SoftwareIntroSectionSoftwareData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}
