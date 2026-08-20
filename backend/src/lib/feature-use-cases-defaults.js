import featureUseCasesDefaults from "../../../database/defaults/feature-use-cases.json" with { type: "json" };

export function defaultFeatureUseCasesSectionData() {
  return structuredClone(featureUseCasesDefaults);
}
