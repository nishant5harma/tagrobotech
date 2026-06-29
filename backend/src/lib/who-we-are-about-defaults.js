import whoWeAreAboutDefaults from "../../../database/defaults/who-we-are-about.json" with { type: "json" };

export function defaultWhoWeAreAboutSectionData() {
  return structuredClone(whoWeAreAboutDefaults);
}
