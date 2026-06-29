import reachTrustAboutDefaults from "../../../database/defaults/reach-trust-about.json" with { type: "json" };

export function defaultReachTrustAboutSectionData() {
  return structuredClone(reachTrustAboutDefaults);
}
