export type SolutionPageHeroBreadcrumb = {
  label: string;
  href: string | null;
};

export type SolutionPageHeroButton = {
  text: string;
  link: string;
};

export type SolutionPageHeroStat = {
  value: string;
  label: string;
};

export type SolutionPageHeroData = {
  breadcrumbs: SolutionPageHeroBreadcrumb[];
  heading: string;
  description: string;
  primary_button: SolutionPageHeroButton;
  secondary_button: SolutionPageHeroButton;
  stats: SolutionPageHeroStat[];
  desktop_image_src: string;
  desktop_image_alt: string;
  desktop_image_url?: string | null;
  mobile_image_src: string;
  mobile_image_alt: string;
  mobile_image_url?: string | null;
};

export const DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING: SolutionPageHeroData = {
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
  desktop_image_src: "/assets-images/laptop.png",
  desktop_image_alt: "Footprints asset tracking dashboard on desktop",
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

function asBreadcrumbs(value: unknown): SolutionPageHeroBreadcrumb[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING.breadcrumbs];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING.breadcrumbs[index] ?? {
      label: "",
      href: null,
    };

    return {
      label: String(row.label ?? fallback.label),
      href: row.href ? String(row.href) : null,
    };
  });
}

function asButton(value: unknown, fallback: SolutionPageHeroButton): SolutionPageHeroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function asStats(value: unknown): SolutionPageHeroStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING.stats];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING.stats[index] ?? {
      value: "",
      label: "",
    };

    return {
      value: String(row.value ?? fallback.value),
      label: String(row.label ?? fallback.label),
    };
  });
}

export function normalizeSolutionPageHeroData(raw: unknown): SolutionPageHeroData {
  const data = asRecord(raw);
  const defaults = DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING;

  return {
    breadcrumbs: asBreadcrumbs(data.breadcrumbs),
    heading: String(data.heading ?? defaults.heading),
    description: String(data.description ?? defaults.description),
    primary_button: asButton(data.primary_button, defaults.primary_button),
    secondary_button: asButton(data.secondary_button, defaults.secondary_button),
    stats: asStats(data.stats),
    desktop_image_src: String(data.desktop_image_src ?? defaults.desktop_image_src),
    desktop_image_alt: String(data.desktop_image_alt ?? defaults.desktop_image_alt),
    desktop_image_url: data.desktop_image_url ? String(data.desktop_image_url) : null,
    mobile_image_src: String(data.mobile_image_src ?? defaults.mobile_image_src),
    mobile_image_alt: String(data.mobile_image_alt ?? defaults.mobile_image_alt),
    mobile_image_url: data.mobile_image_url ? String(data.mobile_image_url) : null,
  };
}

export function mergeSolutionPageHeroData(
  cmsData: SolutionPageHeroData | null | undefined
): SolutionPageHeroData {
  if (!cmsData) return DEFAULT_SOLUTION_PAGE_HERO_MANUFACTURING;
  return normalizeSolutionPageHeroData(cmsData);
}

export function solutionHeroImageSrc(
  localSrc: string,
  mediaUrl?: string | null
): string {
  if (mediaUrl) {
    if (mediaUrl.startsWith("http")) return mediaUrl;
    const base = process.env.NEXT_PUBLIC_CMS_API_URL ?? "";
    return `${base}${mediaUrl}`;
  }
  return localSrc;
}
