import trustedDefaults from "../../../database/defaults/trusted-industries.json" with { type: "json" };

export function defaultTrustedIndustriesSectionData() {
  return structuredClone(trustedDefaults);
}
