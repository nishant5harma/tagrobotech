import ctaReusableDefaults from "../../../database/defaults/cta-reusable.json" with { type: "json" };

export function defaultCtaReusableSectionData() {
  return structuredClone(ctaReusableDefaults);
}
