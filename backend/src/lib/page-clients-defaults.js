import pageClientsDefaults from "../../../database/defaults/page-clients.json" with { type: "json" };

export function defaultPageClientsSectionData() {
  return structuredClone(pageClientsDefaults);
}
