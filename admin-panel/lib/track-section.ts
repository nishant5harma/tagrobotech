import trackDefaults from "@/lib/data/track-section.json";

export type TrackStat = {
  value: string;
  label: string;
};

export type TrackItem = {
  title: string;
  category: string;
  description: string;
  media_id: string | null;
  image_alt: string;
  image_src: string;
};

export type TrackSectionData = {
  tagline: string;
  heading: string;
  description: string;
  cta_button: { text: string; link: string };
  stats: TrackStat[];
  items: TrackItem[];
};

export const TRACK_CATEGORIES = [
  "Enterprise",
  "Inventory",
  "Manufacturing",
  "Operations",
  "Retail",
  "Real Estate",
  "Logistics",
  "Workforce",
  "Healthcare",
  "Safety",
  "Defense",
  "Compliance",
  "Security",
  "Government",
  "Culture",
  "Wildlife",
] as const;

export const DEFAULT_TRACK_SECTION: TrackSectionData = trackDefaults as TrackSectionData;

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

function asButton(value: unknown, fallback: TrackSectionData["cta_button"]) {
  if (value && typeof value === "object") {
    const btn = value as Record<string, unknown>;
    return {
      text: String(btn.text ?? fallback.text),
      link: String(btn.link ?? fallback.link),
    };
  }
  return fallback;
}

function asStats(value: unknown): TrackStat[] {
  if (!Array.isArray(value)) return [...DEFAULT_TRACK_SECTION.stats];
  return value.map((item, index) => {
    const stat = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TRACK_SECTION.stats[index] ?? { value: "", label: "" };
    return {
      value: String(stat.value ?? fallback.value),
      label: String(stat.label ?? fallback.label),
    };
  });
}

function asItems(value: unknown): TrackItem[] {
  if (!Array.isArray(value) || value.length === 0) return [...DEFAULT_TRACK_SECTION.items];

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TRACK_SECTION.items[index] ?? {
      title: "",
      category: "Enterprise",
      description: "",
      media_id: null,
      image_alt: "",
      image_src: "",
    };

    return {
      title: String(row.title ?? fallback.title),
      category: String(row.category ?? fallback.category),
      description: String(row.description ?? fallback.description),
      media_id: row.media_id ? String(row.media_id) : null,
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_src: String(row.image_src ?? fallback.image_src),
    };
  });
}

export function normalizeTrackSectionData(raw: unknown): TrackSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_TRACK_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_TRACK_SECTION.heading),
    description: String(data.description ?? DEFAULT_TRACK_SECTION.description),
    cta_button: asButton(data.cta_button, DEFAULT_TRACK_SECTION.cta_button),
    stats: asStats(data.stats).length ? asStats(data.stats) : [...DEFAULT_TRACK_SECTION.stats],
    items: asItems(data.items),
  };
}

export function trackSectionToPayload(data: TrackSectionData): Record<string, unknown> {
  return { ...data };
}
