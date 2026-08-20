import resourceHowItWorksDefaults from "../../../database/defaults/resource-how-it-works.json" with { type: "json" };

export function defaultResourceHowItWorksSectionData() {
  return structuredClone(resourceHowItWorksDefaults);
}
