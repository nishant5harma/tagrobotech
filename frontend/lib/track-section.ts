import { TRACKING_SOLUTIONS } from "@/lib/tracking-solutions";

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
  image_url?: string | null;
};

export type TrackSectionData = {
  tagline: string;
  heading: string;
  description: string;
  cta_button: { text: string; link: string };
  stats: TrackStat[];
  items: TrackItem[];
};

function defaultItems(): TrackItem[] {
  return TRACKING_SOLUTIONS.map((solution) => ({
    title: solution.title,
    category: solution.category,
    description: solution.description,
    media_id: null,
    image_alt: solution.imageAlt,
    image_src: solution.imageSrc,
  }));
}

export const DEFAULT_TRACK_SECTION: TrackSectionData = {
  tagline: "Tracking Solutions",
  heading: "What we track",
  description:
    "From fixed assets and fleet to patients, documents, and wildlife — as industry pioneers, we were among the first to deliver tracking for almost everything that needs visibility.",
  cta_button: { text: "Get a tracking consultation", link: "/contact" },
  stats: [
    { value: `${TRACKING_SOLUTIONS.length}+`, label: "Use cases" },
    { value: "10+", label: "Industries" },
    { value: "24/7", label: "Visibility" },
  ],
  items: defaultItems(),
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
  if (!Array.isArray(value) || value.length === 0) return defaultItems();

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = defaultItems()[index] ?? {
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
      image_url: row.image_url ? String(row.image_url) : null,
    };
  });
}

export function normalizeTrackSectionData(raw: unknown): TrackSectionData {
  const data = asRecord(raw);
  const items = asItems(data.items);

  return {
    tagline: String(data.tagline ?? DEFAULT_TRACK_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_TRACK_SECTION.heading),
    description: String(data.description ?? DEFAULT_TRACK_SECTION.description),
    cta_button: asButton(data.cta_button, DEFAULT_TRACK_SECTION.cta_button),
    stats: asStats(data.stats).length ? asStats(data.stats) : [...DEFAULT_TRACK_SECTION.stats],
    items,
  };
}

export function mergeTrackSectionData(cmsData: TrackSectionData | null): TrackSectionData {
  if (!cmsData) return DEFAULT_TRACK_SECTION;
  return normalizeTrackSectionData(cmsData);
}

export function trackItemImageSrc(item: TrackItem): string {
  if (item.image_url) return item.image_url;
  return item.image_src;
}

export type TrackingSolutionCard = {
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export function toTrackingSolutionCards(
  section: TrackSectionData,
  resolveUrl: (url: string) => string
): TrackingSolutionCard[] {
  return section.items.map((item) => ({
    title: item.title,
    category: item.category,
    description: item.description,
    imageSrc: item.image_url ? resolveUrl(item.image_url) : item.image_src,
    imageAlt: item.image_alt || item.title,
  }));
}
