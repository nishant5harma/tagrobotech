import resourceToolWorkspaceDefaults from "../../../database/defaults/resource-tool-workspace.json" with { type: "json" };

export function defaultResourceToolWorkspaceSectionData() {
  return structuredClone(resourceToolWorkspaceDefaults);
}
