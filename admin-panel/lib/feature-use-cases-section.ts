import featureUseCasesDefaults from "@/lib/data/feature-use-cases.json";

export type FeatureUseCaseItem = {
  title: string;
  description: string;
};

export type FeatureUseCasesSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: FeatureUseCaseItem[];
};

export const DEFAULT_FEATURE_USE_CASES_SECTION: FeatureUseCasesSectionData =
  featureUseCasesDefaults as FeatureUseCasesSectionData;

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

function normalizeItems(value: unknown): FeatureUseCaseItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FEATURE_USE_CASES_SECTION.items];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_FEATURE_USE_CASES_SECTION.items[index] ?? {
      title: "",
      description: "",
    };
    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeFeatureUseCasesSectionData(
  raw: unknown
): FeatureUseCasesSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_FEATURE_USE_CASES_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FEATURE_USE_CASES_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_FEATURE_USE_CASES_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_FEATURE_USE_CASES_SECTION.description
    ),
    items: normalizeItems(data.items),
  };
}

export function featureUseCasesSectionToPayload(
  data: FeatureUseCasesSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeFeatureUseCasesSectionData(
  cmsData: FeatureUseCasesSectionData | null | undefined
): FeatureUseCasesSectionData {
  if (!cmsData) return DEFAULT_FEATURE_USE_CASES_SECTION;
  return normalizeFeatureUseCasesSectionData(cmsData);
}
