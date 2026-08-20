import featureCapabilitiesDefaults from "../../../database/defaults/feature-capabilities.json" with { type: "json" };

export function defaultFeatureCapabilitiesSectionData() {
  return structuredClone(featureCapabilitiesDefaults);
}
