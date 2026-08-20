import featureCapabilitiesDefaults from "@/lib/data/feature-capabilities.json";

export type FeatureCapabilityItem = {
  title: string;
  description: string;
};

export type FeatureCapabilitiesSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: FeatureCapabilityItem[];
};

export const DEFAULT_FEATURE_CAPABILITIES_SECTION: FeatureCapabilitiesSectionData =
  featureCapabilitiesDefaults as FeatureCapabilitiesSectionData;

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

function normalizeItems(value: unknown): FeatureCapabilityItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FEATURE_CAPABILITIES_SECTION.items];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_FEATURE_CAPABILITIES_SECTION.items[index] ?? {
      title: "",
      description: "",
    };
    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeFeatureCapabilitiesSectionData(
  raw: unknown
): FeatureCapabilitiesSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_FEATURE_CAPABILITIES_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FEATURE_CAPABILITIES_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_FEATURE_CAPABILITIES_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_FEATURE_CAPABILITIES_SECTION.description
    ),
    items: normalizeItems(data.items),
  };
}

export function featureCapabilitiesSectionToPayload(
  data: FeatureCapabilitiesSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeFeatureCapabilitiesSectionData(
  cmsData: FeatureCapabilitiesSectionData | null | undefined
): FeatureCapabilitiesSectionData {
  if (!cmsData) return DEFAULT_FEATURE_CAPABILITIES_SECTION;
  return normalizeFeatureCapabilitiesSectionData(cmsData);
}
