import toolsIntroSectionToolsDefaults from "../../../database/defaults/tools-intro-section-tools.json" with { type: "json" };

export function defaultToolsIntroSectionToolsData() {
  return structuredClone(toolsIntroSectionToolsDefaults);
}
