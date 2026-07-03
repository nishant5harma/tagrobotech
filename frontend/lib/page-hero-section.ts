import { resolveCmsMediaUrl } from "@/lib/cms";

export type PageHeroBreadcrumb = {
  label: string;
  href: string | null;
};

export type PageHeroButton = {
  text: string;
  link: string;
};

export type PageHeroStat = {
  value: string;
  label: string;
};

export type PageHeroSectionData = {
  breadcrumbs: PageHeroBreadcrumb[];
  heading: string;
  description: string;
  primary_button: PageHeroButton;
  secondary_button: PageHeroButton;
  stats: PageHeroStat[];
  desktop_image_media_id: string | null;
  desktop_image_src: string;
  desktop_image_alt: string;
  desktop_image_url?: string | null;
  mobile_image_media_id: string | null;
  mobile_image_src: string;
  mobile_image_alt: string;
  mobile_image_url?: string | null;
};

export type PageHeroContext = {
  pageType?: string;
  pageTitle?: string;
};

export const DEFAULT_PAGE_HERO_SECTION: PageHeroSectionData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "Manufacturing", href: null },
  ],
  heading: "Optimize Manufacturing Efficiency with Smart Asset Management",
  description:
    "Empower your plants with real-time asset visibility, predictive maintenance, and effortless compliance across production lines boosting uptime and throughput.",
  primary_button: {
    text: "Schedule a free demo",
    link: "/contact",
  },
  secondary_button: {
    text: "Get started for free",
    link: "/contact",
  },
  stats: [
    { value: "45%", label: "Downtime Reduction" },
    { value: "+30%", label: "Maintenance Efficiency" },
    { value: "2X", label: "Audit Speed" },
  ],
  desktop_image_media_id: null,
  desktop_image_src: "/assets-images/laptop.png",
  desktop_image_alt: "Footprints asset tracking dashboard on desktop",
  mobile_image_media_id: null,
  mobile_image_src: "/assets-images/laptop.png",
  mobile_image_alt: "Footprints mobile asset dashboard",
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

function titleCase(value: string) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPageTypeLabel(pageType?: string) {
  if (!pageType) return "Solutions";
  const normalized = pageType.toLowerCase();
  if (normalized === "resource") return "Resources";
  if (normalized === "feature") return "Features";
  if (normalized === "solution") return "Solutions";
  if (normalized === "service") return "Services";
  return titleCase(normalized);
}

function getPageTypeHref(pageType?: string) {
  if (!pageType) return "/solutions";
  const normalized = pageType.toLowerCase();
  if (normalized === "resource") return "/resources";
  if (normalized === "feature") return "/features";
  if (normalized === "solution") return "/solutions";
  if (normalized === "service") return "/services";
  return `/${normalized}`;
}

export function createPageHeroFallback(context?: PageHeroContext): PageHeroSectionData {
  const pageTypeLabel = getPageTypeLabel(context?.pageType);
  const pageTypeHref = getPageTypeHref(context?.pageType);
  const pageTitle = context?.pageTitle?.trim() || DEFAULT_PAGE_HERO_SECTION.heading;

  return {
    ...DEFAULT_PAGE_HERO_SECTION,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: pageTypeLabel, href: pageTypeHref },
      { label: pageTitle, href: null },
    ],
    heading: pageTitle,
  };
}

function normalizeBreadcrumbs(
  value: unknown,
  fallback: PageHeroSectionData
): PageHeroBreadcrumb[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.breadcrumbs.map((item) => ({ ...item }));
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(row.label ?? ""),
      href: row.href ? String(row.href) : null,
    };
  });
}

function normalizeButton(value: unknown, fallback: PageHeroButton): PageHeroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeStats(value: unknown, fallback: PageHeroSectionData): PageHeroStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.stats.map((item) => ({ ...item }));
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      value: String(row.value ?? ""),
      label: String(row.label ?? ""),
    };
  });
}

export function normalizePageHeroSectionData(
  raw: unknown,
  context?: PageHeroContext
): PageHeroSectionData {
  const data = asRecord(raw);
  const fallback = createPageHeroFallback(context);

  return {
    breadcrumbs: normalizeBreadcrumbs(data.breadcrumbs, fallback),
    heading: String(data.heading ?? fallback.heading),
    description: String(data.description ?? fallback.description),
    primary_button: normalizeButton(data.primary_button, fallback.primary_button),
    secondary_button: normalizeButton(data.secondary_button, fallback.secondary_button),
    stats: normalizeStats(data.stats, fallback),
    desktop_image_media_id: data.desktop_image_media_id
      ? String(data.desktop_image_media_id)
      : null,
    desktop_image_src: String(data.desktop_image_src ?? fallback.desktop_image_src),
    desktop_image_alt: String(data.desktop_image_alt ?? fallback.desktop_image_alt),
    desktop_image_url: data.desktop_image_url ? String(data.desktop_image_url) : null,
    mobile_image_media_id: data.mobile_image_media_id ? String(data.mobile_image_media_id) : null,
    mobile_image_src: String(data.mobile_image_src ?? fallback.mobile_image_src),
    mobile_image_alt: String(data.mobile_image_alt ?? fallback.mobile_image_alt),
    mobile_image_url: data.mobile_image_url ? String(data.mobile_image_url) : null,
  };
}

export function mergePageHeroSectionData(
  cmsData: PageHeroSectionData | null | undefined,
  context?: PageHeroContext
): PageHeroSectionData {
  if (!cmsData) {
    return createPageHeroFallback(context);
  }

  return normalizePageHeroSectionData(cmsData, context);
}

export function pageHeroImageSrc(localSrc: string, mediaUrl?: string | null): string {
  if (mediaUrl) return resolveCmsMediaUrl(mediaUrl);
  return localSrc;
}
