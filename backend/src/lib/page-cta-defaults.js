import pageCtaDefaults from "../../../database/defaults/page-cta.json" with { type: "json" };

export function defaultPageCtaSectionData() {
  return structuredClone(pageCtaDefaults);
}
