import ourJourneyAboutDefaults from "@/lib/data/our-journey-about.json";

export type JourneyImageFit = "cover" | "contain";

export type OurJourneyItem = {
  year: string;
  title: string;
  description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_fit: JourneyImageFit;
};

export type OurJourneyAboutSectionData = {
  tagline: string;
  heading: string;
  description: string;
  items: OurJourneyItem[];
};

export const DEFAULT_OUR_JOURNEY_ABOUT_SECTION: OurJourneyAboutSectionData =
  ourJourneyAboutDefaults as OurJourneyAboutSectionData;

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

function asItems(value: unknown): OurJourneyItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_OUR_JOURNEY_ABOUT_SECTION.items];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_OUR_JOURNEY_ABOUT_SECTION.items[index] ?? {
      year: "",
      title: "",
      description: "",
      image_media_id: null,
      image_src: "",
      image_alt: "",
      image_fit: "cover" as JourneyImageFit,
    };

    return {
      year: String(row.year ?? fallback.year),
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_fit: row.image_fit === "contain" ? "contain" : "cover",
    };
  });
}

export function normalizeOurJourneyAboutSectionData(raw: unknown): OurJourneyAboutSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.heading),
    description: String(data.description ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.description),
    items: asItems(data.items),
  };
}

export function ourJourneyAboutSectionToPayload(
  data: OurJourneyAboutSectionData
): Record<string, unknown> {
  return { ...data };
}
