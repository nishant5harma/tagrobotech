import defaults from "@/lib/data/hero-section-tools.json";

export type HeroSectionToolsButton = {
  text: string;
  link: string;
};

export type HeroSectionToolsData = {
  tagline: string;
  heading: string;
  description: string;
  phone_label: string;
  phone_number: string;
  primary_button: HeroSectionToolsButton;
  secondary_button: HeroSectionToolsButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
};

export const DEFAULT_HERO_SECTION_TOOLS: HeroSectionToolsData = defaults as HeroSectionToolsData;

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

function asButton(value: unknown, fallback: HeroSectionToolsButton): HeroSectionToolsButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizeHeroSectionToolsData(raw: unknown): HeroSectionToolsData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_HERO_SECTION_TOOLS.tagline),
    heading: String(data.heading ?? DEFAULT_HERO_SECTION_TOOLS.heading),
    description: String(data.description ?? DEFAULT_HERO_SECTION_TOOLS.description),
    phone_label: String(data.phone_label ?? DEFAULT_HERO_SECTION_TOOLS.phone_label),
    phone_number: String(data.phone_number ?? DEFAULT_HERO_SECTION_TOOLS.phone_number),
    primary_button: asButton(data.primary_button, DEFAULT_HERO_SECTION_TOOLS.primary_button),
    secondary_button: asButton(data.secondary_button, DEFAULT_HERO_SECTION_TOOLS.secondary_button),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_HERO_SECTION_TOOLS.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_HERO_SECTION_TOOLS.image_alt),
  };
}

export function heroSectionToolsToPayload(data: HeroSectionToolsData): Record<string, unknown> {
  return { ...data };
}
