import softwareModulesSectionSoftwareDefaults from "../../../database/defaults/software-modules-section-software.json" with { type: "json" };
export function defaultSoftwareModulesSectionSoftwareData() {
  return structuredClone(softwareModulesSectionSoftwareDefaults);
}
