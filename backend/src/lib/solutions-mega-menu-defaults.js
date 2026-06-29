import solutionsMegaMenuDefaults from "../../../database/defaults/solutions-mega-menu.json" with { type: "json" };

export function defaultSolutionsMegaMenuData() {
  return structuredClone(solutionsMegaMenuDefaults);
}
