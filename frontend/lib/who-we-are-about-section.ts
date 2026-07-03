import { resolveCmsMediaUrl } from "@/lib/cms";

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
  image_url?: string | null;
  features: WhoWeAreFeature[];
};

export const DEFAULT_WHO_WE_ARE_ABOUT_SECTION: WhoWeAreAboutSectionData = {
  tagline: "Who We Are",
  heading: "Built on field reality, not presentation slides",
  paragraphs: [
    "Tag RoBo Tech designs solutions by leveraging the core strengths of different types of tags, robotics, and technology.",
    "Over the last 13 years, we have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, and remote sites.",
  ],
  image_media_id: null,
  image_src: "/assets-images/employee_tracking.jpg.jpeg",
  image_alt: "Experienced field team and execution",
  features: [
    {
      tagline: "Ground Team",
      description:
        "We identify, reconcile, gather data, tag, and monitor the underlying ecosystem with experienced execution teams.",
      style: "white",
    },
    {
      tagline: "Cost Effective",
      description:
        "Our solutions help clients achieve well beyond compliance while keeping execution practical and commercially sound.",
      style: "muted",
    },
  ],
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

    return {
      tagline: String(row.tagline ?? fallback.tagline),
      description: String(row.description ?? fallback.description),
      style: row.style === "muted" ? "muted" : "white",
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
    image_url: data.image_url ? String(data.image_url) : null,
    features: asFeatures(data.features),
  };
}

export function mergeWhoWeAreAboutSectionData(
  cmsData: WhoWeAreAboutSectionData | null
): WhoWeAreAboutSectionData {
  if (!cmsData) return DEFAULT_WHO_WE_ARE_ABOUT_SECTION;
  return normalizeWhoWeAreAboutSectionData(cmsData);
}

export function whoWeAreAboutImageSrc(section: WhoWeAreAboutSectionData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}
