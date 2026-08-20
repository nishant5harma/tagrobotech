import featureOverviewDefaults from "@/lib/data/feature-overview.json";

export type FeatureOverviewSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  body: string;
  bullets: string[];
  aside_title: string;
  aside_text: string;
};

export const DEFAULT_FEATURE_OVERVIEW_SECTION: FeatureOverviewSectionData =
  featureOverviewDefaults as FeatureOverviewSectionData;

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

function normalizeBullets(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FEATURE_OVERVIEW_SECTION.bullets];
  }
  return value.map((item, index) =>
    String(item ?? DEFAULT_FEATURE_OVERVIEW_SECTION.bullets[index] ?? "")
  );
}

export function normalizeFeatureOverviewSectionData(
  raw: unknown
): FeatureOverviewSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_FEATURE_OVERVIEW_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FEATURE_OVERVIEW_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_FEATURE_OVERVIEW_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_FEATURE_OVERVIEW_SECTION.description
    ),
    body: String(data.body ?? DEFAULT_FEATURE_OVERVIEW_SECTION.body),
    bullets: normalizeBullets(data.bullets),
    aside_title: String(
      data.aside_title ?? DEFAULT_FEATURE_OVERVIEW_SECTION.aside_title
    ),
    aside_text: String(
      data.aside_text ?? DEFAULT_FEATURE_OVERVIEW_SECTION.aside_text
    ),
  };
}

export function featureOverviewSectionToPayload(
  data: FeatureOverviewSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeFeatureOverviewSectionData(
  cmsData: FeatureOverviewSectionData | null | undefined
): FeatureOverviewSectionData {
  if (!cmsData) return DEFAULT_FEATURE_OVERVIEW_SECTION;
  return normalizeFeatureOverviewSectionData(cmsData);
}
