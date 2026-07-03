import assetManagementSolutionDefaults from "../../../database/defaults/asset-management-solution.json" with { type: "json" };

export function defaultAssetManagementSolutionSectionData() {
  return structuredClone(assetManagementSolutionDefaults);
}
