import footprintsDefaults from "@/lib/data/footprints.json";

export type FootprintFeatureIcon =
  | "map-pin"
  | "refresh"
  | "activity"
  | "wrench"
  | "clipboard"
  | "alert"
  | "map"
  | "file"
  | "plug";

export type FootprintsFeature = {
  title: string;
  description: string;
  icon: FootprintFeatureIcon;
};

export type FootprintsSectionData = {
  tagline: string;
  heading: string;
  description: string;
  tags: string[];
  capabilities_label: string;
  capabilities_badge: string;
  dashboard_media_id: string | null;
  dashboard_image_src: string;
  dashboard_image_alt: string;
  features: FootprintsFeature[];
};

export const FEATURE_ICON_OPTIONS: Array<{ value: FootprintFeatureIcon; label: string }> = [
  { value: "map-pin", label: "Map pin" },
  { value: "refresh", label: "Refresh" },
  { value: "activity", label: "Activity" },
  { value: "wrench", label: "Wrench" },
  { value: "clipboard", label: "Clipboard" },
  { value: "alert", label: "Alert" },
  { value: "map", label: "Map" },
  { value: "file", label: "File" },
  { value: "plug", label: "Plug" },
];

export const DEFAULT_FOOTPRINTS_SECTION: FootprintsSectionData =
  footprintsDefaults as FootprintsSectionData;

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

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_FOOTPRINTS_SECTION.tags];
  const tags = value.map((tag) => String(tag ?? "").trim()).filter(Boolean);
  return tags.length ? tags : [...DEFAULT_FOOTPRINTS_SECTION.tags];
}

function asIcon(value: unknown, fallback: FootprintFeatureIcon): FootprintFeatureIcon {
  const icon = String(value ?? fallback);
  return FEATURE_ICON_OPTIONS.some((option) => option.value === icon)
    ? (icon as FootprintFeatureIcon)
    : fallback;
}

function asFeatures(value: unknown): FootprintsFeature[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FOOTPRINTS_SECTION.features];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_FOOTPRINTS_SECTION.features[index] ?? {
      title: "",
      description: "",
      icon: "map-pin" as FootprintFeatureIcon,
    };

    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
      icon: asIcon(row.icon, fallback.icon),
    };
  });
}

export function normalizeFootprintsSectionData(raw: unknown): FootprintsSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_FOOTPRINTS_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FOOTPRINTS_SECTION.heading),
    description: String(data.description ?? DEFAULT_FOOTPRINTS_SECTION.description),
    tags: asTags(data.tags),
    capabilities_label: String(
      data.capabilities_label ?? DEFAULT_FOOTPRINTS_SECTION.capabilities_label
    ),
    capabilities_badge: String(
      data.capabilities_badge ?? DEFAULT_FOOTPRINTS_SECTION.capabilities_badge
    ),
    dashboard_media_id: data.dashboard_media_id ? String(data.dashboard_media_id) : null,
    dashboard_image_src: String(
      data.dashboard_image_src ?? DEFAULT_FOOTPRINTS_SECTION.dashboard_image_src
    ),
    dashboard_image_alt: String(
      data.dashboard_image_alt ?? DEFAULT_FOOTPRINTS_SECTION.dashboard_image_alt
    ),
    features: asFeatures(data.features),
  };
}

export function footprintsSectionToPayload(data: FootprintsSectionData): Record<string, unknown> {
  return { ...data };
}
