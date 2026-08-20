import featureWorkflowDefaults from "../../../database/defaults/feature-workflow.json" with { type: "json" };

export function defaultFeatureWorkflowSectionData() {
  return structuredClone(featureWorkflowDefaults);
}
