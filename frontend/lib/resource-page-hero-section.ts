export type ResourcePageHeroSectionData = {
  tagline: string;
  heading: string;
  description: string;
};

export const DEFAULT_RESOURCE_PAGE_HERO_SECTION: ResourcePageHeroSectionData = {
  tagline: "Resources",
  heading: "Page title",
  description: "Brief introduction for this resource page.",
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

export function normalizeResourcePageHeroSectionData(
  raw: unknown
): ResourcePageHeroSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_RESOURCE_PAGE_HERO_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_RESOURCE_PAGE_HERO_SECTION.heading),
    description: String(data.description ?? DEFAULT_RESOURCE_PAGE_HERO_SECTION.description),
  };
}

export function mergeResourcePageHeroSectionData(
  cmsData: ResourcePageHeroSectionData | null
): ResourcePageHeroSectionData {
  if (!cmsData) return DEFAULT_RESOURCE_PAGE_HERO_SECTION;
  return normalizeResourcePageHeroSectionData(cmsData);
}
