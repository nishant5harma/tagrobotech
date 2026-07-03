import softwareCtaSectionSoftwareDefaults from "../../../database/defaults/software-cta-section-software.json" with { type: "json" };
export function defaultSoftwareCtaSectionSoftwareData() {
  return structuredClone(softwareCtaSectionSoftwareDefaults);
}
