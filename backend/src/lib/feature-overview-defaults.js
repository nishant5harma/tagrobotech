import featureOverviewDefaults from "../../../database/defaults/feature-overview.json" with { type: "json" };

export function defaultFeatureOverviewSectionData() {
  return structuredClone(featureOverviewDefaults);
}
