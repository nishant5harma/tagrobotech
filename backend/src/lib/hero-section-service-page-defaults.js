import heroSectionServicePageDefaults from "../../../database/defaults/hero-section-service-page.json" with { type: "json" };

export function defaultHeroSectionServicePageData() {
  return structuredClone(heroSectionServicePageDefaults);
}
