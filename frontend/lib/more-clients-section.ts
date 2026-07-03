import { resolveCmsMediaUrl } from "@/lib/cms";
import { HOME_CLIENT_LOGOS, type ClientLogo } from "@/lib/clients";

export type MoreClientLogoItem = {
  id: string;
  name: string;
  media_id: string | null;
  logo_src: string;
  logo_url?: string | null;
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

function defaultItems(): MoreClientLogoItem[] {
  return HOME_CLIENT_LOGOS.map((logo) => ({
    id: logo.id,
    name: logo.alt,
    media_id: null,
    logo_src: logo.src,
  }));
}

export const DEFAULT_MORE_CLIENTS_SECTION: MoreClientsSectionData = {
  tagline: "Our Clients",
  heading: "Companies we",
  heading_accent: "collaborate",
  heading_suffix: "with",
  description:
    "Trusted by leading enterprises across retail, healthcare, media, manufacturing, and more.",
  cta_button: {
    text: "View all clients",
    link: "/clients",
  },
  items: defaultItems(),
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

function asCtaButton(value: unknown): MoreClientsSectionData["cta_button"] {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? DEFAULT_MORE_CLIENTS_SECTION.cta_button.text),
    link: String(row.link ?? DEFAULT_MORE_CLIENTS_SECTION.cta_button.link),
  };
}

function asItems(value: unknown): MoreClientLogoItem[] {
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
        logo_src: "",
        logo_url: row.logo_url ? String(row.logo_url) : null,
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

export function mergeMoreClientsSectionData(
  cmsData: MoreClientsSectionData | null
): MoreClientsSectionData {
  if (!cmsData) return DEFAULT_MORE_CLIENTS_SECTION;
  return normalizeMoreClientsSectionData(cmsData);
}

export function toLogoCloudItems(section: MoreClientsSectionData): ClientLogo[] {
  return section.items
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
}
