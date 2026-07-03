import pageClientsDefaults from "@/lib/data/page-clients.json";

export type PageClientLogoItem = {
  media_id: string | null;
  name: string;
  website_url: string;
  logo_src: string;
};

export type PageClientsSectionData = {
  heading_prefix: string;
  heading_highlight: string;
  heading_suffix: string;
  items: PageClientLogoItem[];
};

export const DEFAULT_PAGE_CLIENTS_SECTION: PageClientsSectionData =
  pageClientsDefaults as PageClientsSectionData;

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

function normalizeItems(value: unknown): PageClientLogoItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const mediaId = row.media_id ? String(row.media_id) : null;
      const logoSrc = row.logo_src ? String(row.logo_src) : "";

      if (!mediaId && !logoSrc) return null;

      return {
        media_id: mediaId,
        name: String(row.name ?? `Client ${index + 1}`),
        website_url: String(row.website_url ?? ""),
        logo_src: logoSrc,
      };
    })
    .filter(Boolean) as PageClientLogoItem[];
}

export function normalizePageClientsSectionData(raw: unknown): PageClientsSectionData {
  const data = asRecord(raw);

  return {
    heading_prefix: String(data.heading_prefix ?? DEFAULT_PAGE_CLIENTS_SECTION.heading_prefix),
    heading_highlight: String(
      data.heading_highlight ?? DEFAULT_PAGE_CLIENTS_SECTION.heading_highlight
    ),
    heading_suffix: String(data.heading_suffix ?? DEFAULT_PAGE_CLIENTS_SECTION.heading_suffix),
    items: normalizeItems(data.items),
  };
}

export function pageClientsSectionToPayload(
  data: PageClientsSectionData
): Record<string, unknown> {
  return { ...data };
}
