import resourceHowItWorksDefaults from "@/lib/data/resource-how-it-works.json";

export type ResourceHowItWorksStep = {
  title: string;
  description: string;
};

export type ResourceHowItWorksSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  steps: ResourceHowItWorksStep[];
};

export const DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION: ResourceHowItWorksSectionData =
  resourceHowItWorksDefaults as ResourceHowItWorksSectionData;

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

function normalizeSteps(value: unknown): ResourceHowItWorksStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.steps];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.steps[index] ?? {
      title: "",
      description: "",
    };
    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeResourceHowItWorksSectionData(
  raw: unknown
): ResourceHowItWorksSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION.description
    ),
    steps: normalizeSteps(data.steps),
  };
}

export function resourceHowItWorksSectionToPayload(
  data: ResourceHowItWorksSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeResourceHowItWorksSectionData(
  cmsData: ResourceHowItWorksSectionData | null | undefined
): ResourceHowItWorksSectionData {
  if (!cmsData) return DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION;
  return normalizeResourceHowItWorksSectionData(cmsData);
}
