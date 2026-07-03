import toolsFlagshipSectionToolsDefaults from "../../../database/defaults/tools-flagship-section-tools.json" with { type: "json" };

export function defaultToolsFlagshipSectionToolsData() {
  return structuredClone(toolsFlagshipSectionToolsDefaults);
}
