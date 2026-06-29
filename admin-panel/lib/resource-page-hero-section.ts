import resourcePageHeroDefaults from "@/lib/data/resource-page-hero.json";

export type ResourcePageHeroSectionData = {
  tagline: string;
  heading: string;
  description: string;
};

export const DEFAULT_RESOURCE_PAGE_HERO_SECTION: ResourcePageHeroSectionData =
  resourcePageHeroDefaults as ResourcePageHeroSectionData;

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

export function resourcePageHeroSectionToPayload(
  data: ResourcePageHeroSectionData
): Record<string, unknown> {
  return { ...data };
}
