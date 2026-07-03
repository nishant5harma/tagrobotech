import { resolveCmsMediaUrl } from "@/lib/cms";

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
  image_url?: string | null;
};

export const DEFAULT_ABOUT_PAGE_HERO_SECTION: AboutPageHeroSectionData = {
  tagline: "About Us",
  heading: "Designing the",
  heading_accent: "future",
  heading_suffix: "of tracking",
  description:
    "Tag RoBo Tech turns physical movement into business intelligence with tags, robotics, software, and field execution built for real-world complexity.",
  primary_button: {
    text: "Talk to our team",
    link: "/contact",
  },
  secondary_button: {
    text: "Contact Us: 9319013339",
    link: "tel:+919319013339",
  },
  image_media_id: null,
  image_src: "/assets-images/laptop.png",
  image_alt: "Footprints asset tracking dashboard by Tag Robo Tech",
};

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
    image_url: data.image_url ? String(data.image_url) : null,
  };
}

export function mergeAboutPageHeroSectionData(
  cmsData: AboutPageHeroSectionData | null
): AboutPageHeroSectionData {
  if (!cmsData) return DEFAULT_ABOUT_PAGE_HERO_SECTION;
  return normalizeAboutPageHeroSectionData(cmsData);
}

export function aboutPageHeroImageSrc(section: AboutPageHeroSectionData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}
