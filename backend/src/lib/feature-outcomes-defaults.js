import featureOutcomesDefaults from "../../../database/defaults/feature-outcomes.json" with { type: "json" };

export function defaultFeatureOutcomesSectionData() {
  return structuredClone(featureOutcomesDefaults);
}
