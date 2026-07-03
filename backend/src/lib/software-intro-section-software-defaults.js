import softwareIntroSectionSoftwareDefaults from "../../../database/defaults/software-intro-section-software.json" with { type: "json" };
export function defaultSoftwareIntroSectionSoftwareData() {
  return structuredClone(softwareIntroSectionSoftwareDefaults);
}
