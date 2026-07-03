import heroSectionSoftwareDefaults from "../../../database/defaults/hero-section-software.json" with { type: "json" };
export function defaultHeroSectionSoftwareData() {
  return structuredClone(heroSectionSoftwareDefaults);
}
