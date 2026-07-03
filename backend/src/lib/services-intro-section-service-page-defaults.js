import servicesIntroSectionServicePageDefaults from "../../../database/defaults/services-intro-section-service-page.json" with { type: "json" };

export function defaultServicesIntroSectionServicePageData() {
  return structuredClone(servicesIntroSectionServicePageDefaults);
}
