import moreClientsDefaults from "@/lib/data/more-clients.json";

export type MoreClientLogoItem = {
  media_id: string;
  name: string;
};

export type MoreClientsSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  heading_suffix: string;
  description: string;
  cta_button: {
    text: string;
    link: string;
  };
  items: MoreClientLogoItem[];
};

export const DEFAULT_MORE_CLIENTS_SECTION: MoreClientsSectionData =
  moreClientsDefaults as MoreClientsSectionData;

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

function asCtaButton(value: unknown): MoreClientsSectionData["cta_button"] {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? DEFAULT_MORE_CLIENTS_SECTION.cta_button.text),
    link: String(row.link ?? DEFAULT_MORE_CLIENTS_SECTION.cta_button.link),
  };
}

function asItems(value: unknown): MoreClientLogoItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const mediaId = row.media_id ? String(row.media_id) : "";
      if (!mediaId) return null;

      return {
        media_id: mediaId,
        name: String(row.name ?? `Client ${index + 1}`),
      };
    })
    .filter(Boolean) as MoreClientLogoItem[];
}

export function normalizeMoreClientsSectionData(raw: unknown): MoreClientsSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_MORE_CLIENTS_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_MORE_CLIENTS_SECTION.heading),
    heading_accent: String(data.heading_accent ?? DEFAULT_MORE_CLIENTS_SECTION.heading_accent),
    heading_suffix: String(data.heading_suffix ?? DEFAULT_MORE_CLIENTS_SECTION.heading_suffix),
    description: String(data.description ?? DEFAULT_MORE_CLIENTS_SECTION.description),
    cta_button: asCtaButton(data.cta_button),
    items: asItems(data.items),
  };
}

export function moreClientsSectionToPayload(data: MoreClientsSectionData): Record<string, unknown> {
  return {
    ...data,
    items: data.items.map((item) => ({
      media_id: item.media_id,
      name: item.name,
    })),
  };
}
