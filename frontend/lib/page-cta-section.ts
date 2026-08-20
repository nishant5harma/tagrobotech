export type PageCtaButton = {
  text: string;
  link: string;
};

export type PageCtaSectionData = {
  tagline: string;
  heading: string;
  description: string;
  primary_button: PageCtaButton;
  secondary_button: PageCtaButton;
};

export const DEFAULT_PAGE_CTA_SECTION: PageCtaSectionData = {
  tagline: "END-TO-END EXECUTION",
  heading: "We verify on site, tag intelligently, integrate with ERP, and monitor continuously.",
  description:
    "Tag RoBo Tech has implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, and remote sites — almost everything that needs to be tracked.",
  primary_button: {
    text: "About Tag RoBo Tech",
    link: "/about",
  },
  secondary_button: {
    text: "Request a consultation",
    link: "/contact",
  },
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

function normalizeButton(value: unknown, fallback: PageCtaButton): PageCtaButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizePageCtaSectionData(raw: unknown): PageCtaSectionData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_PAGE_CTA_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_PAGE_CTA_SECTION.heading),
    description: String(data.description ?? DEFAULT_PAGE_CTA_SECTION.description),
    primary_button: normalizeButton(
      data.primary_button,
      DEFAULT_PAGE_CTA_SECTION.primary_button
    ),
    secondary_button: normalizeButton(
      data.secondary_button,
      DEFAULT_PAGE_CTA_SECTION.secondary_button
    ),
  };
}

export function mergePageCtaSectionData(
  cmsData: PageCtaSectionData | null | undefined
): PageCtaSectionData {
  if (!cmsData) return DEFAULT_PAGE_CTA_SECTION;
  return normalizePageCtaSectionData(cmsData);
}
