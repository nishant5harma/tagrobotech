import resourcePageHeroDefaults from "../../../database/defaults/resource-page-hero.json" with { type: "json" };

export function defaultResourcePageHeroSectionData() {
  return structuredClone(resourcePageHeroDefaults);
}
