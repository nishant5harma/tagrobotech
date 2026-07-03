import toolsCtaSectionToolsDefaults from "../../../database/defaults/tools-cta-section-tools.json" with { type: "json" };

export function defaultToolsCtaSectionToolsData() {
  return structuredClone(toolsCtaSectionToolsDefaults);
}
