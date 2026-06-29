export type ClientLogoItem = {
  media_id: string;
  name: string;
  website_url: string;
};

export type ClientsSectionData = {
  heading: string;
  subtext: string;
  items: ClientLogoItem[];
};

export const DEFAULT_CLIENTS_SECTION: ClientsSectionData = {
  heading: "Trusted by leading enterprises — industry pioneers since day one",
  subtext: "and more...",
  items: [],
};

function asRecord(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) ?? {};
}

export function normalizeClientsSectionData(raw: unknown): ClientsSectionData {
  const data = asRecord(raw);
  const items = Array.isArray(data.items)
    ? data.items.map((item, index) => {
        const row = (item ?? {}) as Record<string, unknown>;
        return {
          media_id: String(row.media_id ?? ""),
          name: String(row.name ?? `Client ${index + 1}`),
          website_url: String(row.website_url ?? ""),
        };
      }).filter((item) => item.media_id)
    : [];

  return {
    heading: String(data.heading ?? DEFAULT_CLIENTS_SECTION.heading),
    subtext: String(data.subtext ?? DEFAULT_CLIENTS_SECTION.subtext),
    items,
  };
}

export function clientsSectionToPayload(data: ClientsSectionData): Record<string, unknown> {
  return { ...data };
}
