import featureOutcomesDefaults from "@/lib/data/feature-outcomes.json";

export type FeatureOutcomeItem = {
  value: string;
  label: string;
  description: string;
};

export type FeatureOutcomesSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: FeatureOutcomeItem[];
};

export const DEFAULT_FEATURE_OUTCOMES_SECTION: FeatureOutcomesSectionData =
  featureOutcomesDefaults as FeatureOutcomesSectionData;

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

function normalizeItems(value: unknown): FeatureOutcomeItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FEATURE_OUTCOMES_SECTION.items];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_FEATURE_OUTCOMES_SECTION.items[index] ?? {
      value: "",
      label: "",
      description: "",
    };
    return {
      value: String(row.value ?? fallback.value),
      label: String(row.label ?? fallback.label),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeFeatureOutcomesSectionData(
  raw: unknown
): FeatureOutcomesSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_FEATURE_OUTCOMES_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FEATURE_OUTCOMES_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_FEATURE_OUTCOMES_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_FEATURE_OUTCOMES_SECTION.description
    ),
    items: normalizeItems(data.items),
  };
}

export function featureOutcomesSectionToPayload(
  data: FeatureOutcomesSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeFeatureOutcomesSectionData(
  cmsData: FeatureOutcomesSectionData | null | undefined
): FeatureOutcomesSectionData {
  if (!cmsData) return DEFAULT_FEATURE_OUTCOMES_SECTION;
  return normalizeFeatureOutcomesSectionData(cmsData);
}
