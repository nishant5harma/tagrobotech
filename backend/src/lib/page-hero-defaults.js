import pageHeroDefaults from "../../../database/defaults/page-hero.json" with { type: "json" };

export function defaultPageHeroSectionData() {
  return structuredClone(pageHeroDefaults);
}
