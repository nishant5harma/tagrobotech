import servicesCatalogueSectionServicePageDefaults from "../../../database/defaults/services-catalogue-section-service-page.json" with { type: "json" };

export function defaultServicesCatalogueSectionServicePageData() {
  return structuredClone(servicesCatalogueSectionServicePageDefaults);
}
