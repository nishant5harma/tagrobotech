import reachTrustAboutDefaults from "@/lib/data/reach-trust-about.json";

export type ReachTrustLogoItem = {
  media_id: string;
  name: string;
};

export type ReachTrustAboutSectionData = {
  tagline: string;
  heading: string;
  description: string;
  sectors: string[];
  flagship_clients_label: string;
  flagship_clients: string;
  items: ReachTrustLogoItem[];
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
};

export const DEFAULT_REACH_TRUST_ABOUT_SECTION: ReachTrustAboutSectionData =
  reachTrustAboutDefaults as ReachTrustAboutSectionData;

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

function asSectors(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_REACH_TRUST_ABOUT_SECTION.sectors];
  }

  return value.map((item, index) =>
    String(item ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.sectors[index] ?? "")
  );
}

function asItems(value: unknown): ReachTrustLogoItem[] {
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
    .filter(Boolean) as ReachTrustLogoItem[];
}

export function normalizeReachTrustAboutSectionData(
  raw: unknown
): ReachTrustAboutSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.heading),
    description: String(data.description ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.description),
    sectors: asSectors(data.sectors),
    flagship_clients_label: String(
      data.flagship_clients_label ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.flagship_clients_label
    ),
    flagship_clients: String(
      data.flagship_clients ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.flagship_clients
    ),
    items: asItems(data.items),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.image_alt),
  };
}

export function reachTrustAboutSectionToPayload(
  data: ReachTrustAboutSectionData
): Record<string, unknown> {
  return {
    ...data,
    items: data.items.map((item) => ({
      media_id: item.media_id,
      name: item.name,
    })),
  };
}
