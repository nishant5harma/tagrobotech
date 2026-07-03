import heroSectionToolsDefaults from "../../../database/defaults/hero-section-tools.json" with { type: "json" };

export function defaultHeroSectionToolsData() {
  return structuredClone(heroSectionToolsDefaults);
}
