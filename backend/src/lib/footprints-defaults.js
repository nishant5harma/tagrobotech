import footprintsDefaults from "../../../database/defaults/footprints.json" with { type: "json" };

export function defaultFootprintsSectionData() {
  return structuredClone(footprintsDefaults);
}
