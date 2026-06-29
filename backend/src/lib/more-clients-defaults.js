import moreClientsDefaults from "../../../database/defaults/more-clients.json" with { type: "json" };

export function defaultMoreClientsSectionData() {
  return structuredClone(moreClientsDefaults);
}
