import pageHeroSimpleDefaults from "../../../database/defaults/page-hero-simple.json" with { type: "json" };

export function defaultPageHeroSimpleSectionData() {
  return structuredClone(pageHeroSimpleDefaults);
}
