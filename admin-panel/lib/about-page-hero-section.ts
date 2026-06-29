import aboutPageHeroDefaults from "@/lib/data/about-page-hero.json";

export type AboutPageHeroButton = {
  text: string;
  link: string;
};

export type AboutPageHeroSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  heading_suffix: string;
  description: string;
  primary_button: AboutPageHeroButton;
  secondary_button: AboutPageHeroButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
};

export const DEFAULT_ABOUT_PAGE_HERO_SECTION: AboutPageHeroSectionData =
  aboutPageHeroDefaults as AboutPageHeroSectionData;

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

function asButton(value: unknown, fallback: AboutPageHeroButton): AboutPageHeroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeHeadingFields(data: Record<string, unknown>) {
  let heading = String(data.heading ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.heading);
  let heading_accent = String(
    data.heading_accent ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.heading_accent
  );
  let heading_suffix = String(
    data.heading_suffix ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.heading_suffix
  );

  if (!data.heading_suffix && heading_accent.includes(" ")) {
    const [accentWord, ...suffixWords] = heading_accent.split(" ");
    if (accentWord && suffixWords.length > 0) {
      heading_accent = accentWord;
      heading_suffix = suffixWords.join(" ");
    }
  }

  return { heading, heading_accent, heading_suffix };
}

export function normalizeAboutPageHeroSectionData(raw: unknown): AboutPageHeroSectionData {
  const data = asRecord(raw);
  const headingFields = normalizeHeadingFields(data);

  return {
    tagline: String(data.tagline ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.tagline),
    ...headingFields,
    description: String(data.description ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.description),
    primary_button: asButton(data.primary_button, DEFAULT_ABOUT_PAGE_HERO_SECTION.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_ABOUT_PAGE_HERO_SECTION.secondary_button
    ),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_ABOUT_PAGE_HERO_SECTION.image_alt),
  };
}

export function aboutPageHeroSectionToPayload(
  data: AboutPageHeroSectionData
): Record<string, unknown> {
  return { ...data };
}
