export type ClientLogoItem = {
  media_id: string;
  name: string;
  website_url?: string;
  logo_url?: string;
  alt?: string;
};

export type ClientsSectionData = {
  heading: string;
  subtext: string;
  items: ClientLogoItem[];
};

export function normalizeClientsSectionData(raw: unknown): ClientsSectionData | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const items = Array.isArray(data.items)
    ? data.items
        .map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          const logoUrl = row.logo_url ? String(row.logo_url) : "";
          if (!logoUrl && !row.media_id) return null;
          return {
            media_id: String(row.media_id ?? index),
            name: String(row.name ?? `Client ${index + 1}`),
            website_url: row.website_url ? String(row.website_url) : "",
            logo_url: logoUrl,
            alt: row.alt ? String(row.alt) : String(row.name ?? ""),
          };
        })
        .filter(Boolean) as ClientLogoItem[]
    : [];

  if (!data.heading && items.length === 0) return null;

  return {
    heading: String(data.heading ?? ""),
    subtext: String(data.subtext ?? "and more..."),
    items,
  };
}
