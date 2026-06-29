import ourJourneyAboutDefaults from "../../../database/defaults/our-journey-about.json" with { type: "json" };

export function defaultOurJourneyAboutSectionData() {
  return structuredClone(ourJourneyAboutDefaults);
}
