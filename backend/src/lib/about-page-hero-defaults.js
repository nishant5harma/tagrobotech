import aboutPageHeroDefaults from "../../../database/defaults/about-page-hero.json" with { type: "json" };

export function defaultAboutPageHeroSectionData() {
  return structuredClone(aboutPageHeroDefaults);
}
