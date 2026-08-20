import featureWorkflowDefaults from "@/lib/data/feature-workflow.json";

export type FeatureWorkflowStep = {
  title: string;
  description: string;
};

export type FeatureWorkflowSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  steps: FeatureWorkflowStep[];
};

export const DEFAULT_FEATURE_WORKFLOW_SECTION: FeatureWorkflowSectionData =
  featureWorkflowDefaults as FeatureWorkflowSectionData;

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

function normalizeSteps(value: unknown): FeatureWorkflowStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_FEATURE_WORKFLOW_SECTION.steps];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_FEATURE_WORKFLOW_SECTION.steps[index] ?? {
      title: "",
      description: "",
    };
    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeFeatureWorkflowSectionData(
  raw: unknown
): FeatureWorkflowSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_FEATURE_WORKFLOW_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_FEATURE_WORKFLOW_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_FEATURE_WORKFLOW_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_FEATURE_WORKFLOW_SECTION.description
    ),
    steps: normalizeSteps(data.steps),
  };
}

export function featureWorkflowSectionToPayload(
  data: FeatureWorkflowSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeFeatureWorkflowSectionData(
  cmsData: FeatureWorkflowSectionData | null | undefined
): FeatureWorkflowSectionData {
  if (!cmsData) return DEFAULT_FEATURE_WORKFLOW_SECTION;
  return normalizeFeatureWorkflowSectionData(cmsData);
}
