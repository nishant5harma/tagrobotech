import technologyDefaults from "../../../database/defaults/technology-platform.json" with { type: "json" };

export function defaultTechnologyPlatformSectionData() {
  return structuredClone(technologyDefaults);
}
