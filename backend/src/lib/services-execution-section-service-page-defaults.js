import servicesExecutionSectionServicePageDefaults from "../../../database/defaults/services-execution-section-service-page.json" with { type: "json" };

export function defaultServicesExecutionSectionServicePageData() {
  return structuredClone(servicesExecutionSectionServicePageDefaults);
}
