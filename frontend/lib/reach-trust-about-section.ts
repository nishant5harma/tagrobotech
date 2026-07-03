import { CLIENT_LOGOS, type ClientLogo } from "@/lib/clients";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type ReachTrustLogoItem = {
  id: string;
  name: string;
  media_id: string | null;
  logo_url?: string | null;
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
  image_url?: string | null;
};

export const DEFAULT_REACH_TRUST_ABOUT_SECTION: ReachTrustAboutSectionData = {
  tagline: "Reach & Trust",
  heading: "Flagship clients, cross-sector credibility",
  description:
    "Since onset, we have serviced more than 1000 clients across the globe and maintained 100% success in executing projects across sectors including banks, hospitals, hotels, FMCG, pharma, media, automobile, aviation, insurance, e-commerce, retail, real estate, education, development, and government bodies.",
  sectors: [
    "Banks",
    "Hospitals",
    "Hotels",
    "FMCG",
    "Pharma",
    "Media",
    "Automobile",
    "Aviation",
    "Insurance",
    "Retail",
    "Real Estate",
    "Education",
    "Government",
    "Telecom",
  ],
  flagship_clients_label: "Few flagship clients:",
  flagship_clients:
    "Coca Cola, Accenture, Baskin Robbins, HCL Technologies, Marks & Spencer, Tata Motors, Flipkart, Mankind Pharma, Bose Corporation, Mahindra, Saint-Gobain, Hitachi, IKEA, Save the Children, WaterAid, PVR Cinemas, Max Hospitals, and Brookfield PE.",
  items: [],
  image_media_id: null,
  image_src: "/assets-images/delivery_tracking.jpg.jpeg",
  image_alt: "Global delivery and logistics visibility",
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

function asSectors(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_REACH_TRUST_ABOUT_SECTION.sectors];
  }

  return value.map((item, index) =>
    String(item ?? DEFAULT_REACH_TRUST_ABOUT_SECTION.sectors[index] ?? "")
  );
}

function asItems(value: unknown): ReachTrustLogoItem[] {
  if (!Array.isArray(value) || value.length === 0) return [];

  return value
    .map((item, index) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const mediaId = row.media_id ? String(row.media_id) : "";
      if (!mediaId) return null;

      return {
        id: mediaId,
        name: String(row.name ?? `Client ${index + 1}`),
        media_id: mediaId,
        logo_url: row.logo_url ? String(row.logo_url) : null,
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
    image_url: data.image_url ? String(data.image_url) : null,
  };
}

export function mergeReachTrustAboutSectionData(
  cmsData: ReachTrustAboutSectionData | null
): ReachTrustAboutSectionData {
  if (!cmsData) return DEFAULT_REACH_TRUST_ABOUT_SECTION;
  return normalizeReachTrustAboutSectionData(cmsData);
}

export function reachTrustImageSrc(section: ReachTrustAboutSectionData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}

export function toReachTrustLogoCloudItems(section: ReachTrustAboutSectionData): ClientLogo[] {
  const cmsLogos = section.items
    .map((item) => {
      const src = item.logo_url ? resolveCmsMediaUrl(item.logo_url) : "";
      if (!src) return null;
      return {
        id: item.media_id || item.id,
        src,
        alt: item.name,
      };
    })
    .filter(Boolean) as ClientLogo[];

  if (cmsLogos.length > 0) return cmsLogos;
  return CLIENT_LOGOS;
}
