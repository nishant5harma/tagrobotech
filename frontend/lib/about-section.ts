import { PIONEER_STATEMENT, SPLINE_ROBOT_SCENE } from "@/lib/constants";

export type AboutSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  paragraphs: string[];
  visual_type: "spline" | "image";
  spline_scene_url: string;
  image_id: string | null;
  image_url?: string | null;
};

export const DEFAULT_ABOUT_SECTION: AboutSectionData = {
  tagline: "About Us",
  heading: "Pioneers of",
  heading_accent: "Asset Tracking",
  paragraphs: [
    PIONEER_STATEMENT,
    "Tag RoBo Tech designs solutions by leveraging the core strengths of different types of tags, robotics, and technology.",
    "Over last 10 years, we have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc.. almost everything that needs to be tracked!",
    "Our technology platform applies innovative science to not only track but also collect/ transform data which can be used for operational intelligence...",
  ],
  visual_type: "spline",
  spline_scene_url: SPLINE_ROBOT_SCENE,
  image_id: null,
  image_url: null,
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

export function normalizeAboutSectionData(raw: unknown): AboutSectionData {
  const data = asRecord(raw);

  const paragraphs = Array.isArray(data.paragraphs)
    ? data.paragraphs.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [...DEFAULT_ABOUT_SECTION.paragraphs];

  return {
    tagline: String(data.tagline ?? DEFAULT_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_ABOUT_SECTION.heading),
    heading_accent: String(data.heading_accent ?? DEFAULT_ABOUT_SECTION.heading_accent),
    paragraphs: paragraphs.length ? paragraphs : [...DEFAULT_ABOUT_SECTION.paragraphs],
    visual_type: data.visual_type === "image" ? "image" : "spline",
    spline_scene_url: String(data.spline_scene_url ?? DEFAULT_ABOUT_SECTION.spline_scene_url),
    image_id: data.image_id ? String(data.image_id) : null,
    image_url: data.image_url ? String(data.image_url) : null,
  };
}

export function mergeAboutSectionData(cmsData: AboutSectionData | null): AboutSectionData {
  if (!cmsData) return DEFAULT_ABOUT_SECTION;
  return normalizeAboutSectionData(cmsData);
}
