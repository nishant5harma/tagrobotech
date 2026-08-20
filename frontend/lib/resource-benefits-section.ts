import resourceBenefitsDefaults from "@/lib/data/resource-benefits.json";

export type ResourceBenefitItem = {
  title: string;
  description: string;
};

export type ResourceBenefitsSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: ResourceBenefitItem[];
};

export const DEFAULT_RESOURCE_BENEFITS_SECTION: ResourceBenefitsSectionData =
  resourceBenefitsDefaults as ResourceBenefitsSectionData;

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

function normalizeItems(value: unknown): ResourceBenefitItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_RESOURCE_BENEFITS_SECTION.items];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_RESOURCE_BENEFITS_SECTION.items[index] ?? {
      title: "",
      description: "",
    };
    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeResourceBenefitsSectionData(
  raw: unknown
): ResourceBenefitsSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_RESOURCE_BENEFITS_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_RESOURCE_BENEFITS_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_RESOURCE_BENEFITS_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_RESOURCE_BENEFITS_SECTION.description
    ),
    items: normalizeItems(data.items),
  };
}

export function resourceBenefitsSectionToPayload(
  data: ResourceBenefitsSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeResourceBenefitsSectionData(
  cmsData: ResourceBenefitsSectionData | null | undefined
): ResourceBenefitsSectionData {
  if (!cmsData) return DEFAULT_RESOURCE_BENEFITS_SECTION;
  return normalizeResourceBenefitsSectionData(cmsData);
}
