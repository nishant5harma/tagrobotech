import whatWeDeliverAboutDefaults from "../../../database/defaults/what-we-deliver-about.json" with { type: "json" };

export function defaultWhatWeDeliverAboutSectionData() {
  return structuredClone(whatWeDeliverAboutDefaults);
}
