import whoWeAreAboutDefaults from "@/lib/data/who-we-are-about.json";

export type WhoWeAreFeatureStyle = "white" | "muted";

export type WhoWeAreFeature = {
  tagline: string;
  description: string;
  style: WhoWeAreFeatureStyle;
};

export type WhoWeAreAboutSectionData = {
  tagline: string;
  heading: string;
  paragraphs: string[];
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  features: WhoWeAreFeature[];
};

export const DEFAULT_WHO_WE_ARE_ABOUT_SECTION: WhoWeAreAboutSectionData =
  whoWeAreAboutDefaults as WhoWeAreAboutSectionData;

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

function asParagraphs(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_WHO_WE_ARE_ABOUT_SECTION.paragraphs];
  const paragraphs = value.map((item) => String(item ?? "").trim()).filter(Boolean);
  return paragraphs.length ? paragraphs : [...DEFAULT_WHO_WE_ARE_ABOUT_SECTION.paragraphs];
}

function asFeatures(value: unknown): WhoWeAreFeature[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_WHO_WE_ARE_ABOUT_SECTION.features];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_WHO_WE_ARE_ABOUT_SECTION.features[index] ?? {
      tagline: "",
      description: "",
      style: "white" as WhoWeAreFeatureStyle,
    };

    const style = row.style === "muted" ? "muted" : "white";

    return {
      tagline: String(row.tagline ?? fallback.tagline),
      description: String(row.description ?? fallback.description),
      style,
    };
  });
}

export function normalizeWhoWeAreAboutSectionData(raw: unknown): WhoWeAreAboutSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_WHO_WE_ARE_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_WHO_WE_ARE_ABOUT_SECTION.heading),
    paragraphs: asParagraphs(data.paragraphs),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_WHO_WE_ARE_ABOUT_SECTION.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_WHO_WE_ARE_ABOUT_SECTION.image_alt),
    features: asFeatures(data.features),
  };
}

export function whoWeAreAboutSectionToPayload(
  data: WhoWeAreAboutSectionData
): Record<string, unknown> {
  return {
    ...data,
    paragraphs: data.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
  };
}
