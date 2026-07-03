import { resolveCmsMediaUrl } from "@/lib/cms";
import { TRUSTED_LOGOS } from "@/lib/constants";

export type PageClientLogoItem = {
  media_id: string | null;
  name: string;
  website_url: string;
  logo_src: string;
  logo_url?: string | null;
};

export type PageClientsSectionData = {
  heading_prefix: string;
  heading_highlight: string;
  heading_suffix: string;
  items: PageClientLogoItem[];
};

export const DEFAULT_PAGE_CLIENTS_SECTION: PageClientsSectionData = {
  heading_prefix: "Trusted by",
  heading_highlight: "300+",
  heading_suffix: "Leading Enterprises",
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

function normalizeItems(value: unknown): PageClientLogoItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const mediaId = row.media_id ? String(row.media_id) : null;
      const logoSrc = row.logo_src ? String(row.logo_src) : "";

      if (!mediaId && !logoSrc && !row.logo_url) return null;

      return {
        media_id: mediaId,
        name: String(row.name ?? `Client ${index + 1}`),
        website_url: String(row.website_url ?? ""),
        logo_src: logoSrc,
        logo_url: row.logo_url ? String(row.logo_url) : null,
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

export function mergePageClientsSectionData(
  cmsData: PageClientsSectionData | null | undefined
): PageClientsSectionData {
  if (!cmsData) return DEFAULT_PAGE_CLIENTS_SECTION;
  return normalizePageClientsSectionData(cmsData);
}

export function pageClientLogoSrc(item: PageClientLogoItem): string {
  if (item.logo_url) return resolveCmsMediaUrl(item.logo_url);
  return item.logo_src;
}

export type PageClientLogoDisplay = {
  id: string;
  src: string;
  alt: string;
  href?: string;
};

export function toPageClientLogos(section: PageClientsSectionData): PageClientLogoDisplay[] {
  const cmsLogos = section.items
    .map((item, index) => {
      const src = pageClientLogoSrc(item);
      if (!src) return null;

      return {
        id: item.media_id || `fallback-${index}`,
        src,
        alt: item.name,
        href: item.website_url || undefined,
      };
    })
    .filter(Boolean) as PageClientLogoDisplay[];

  if (cmsLogos.length > 0) return cmsLogos;

  return TRUSTED_LOGOS.map((logo, index) => ({
    id: `default-${index}`,
    src: logo.src,
    alt: logo.alt,
    href: undefined,
  }));
}
