export type PageCtaButton = {
  text: string;
  link: string;
};

export type PageCtaSectionData = {
  heading: string;
  description: string;
  primary_button: PageCtaButton;
  secondary_button: PageCtaButton;
};

export const DEFAULT_PAGE_CTA_SECTION: PageCtaSectionData = {
  heading: "Why Choose Tag RoBo Tech?",
  description:
    "Tag RoBo Tech's asset discovery and tracking solutions, including RFID, BLE, IoT, and agentless methods, provide a comprehensive and flexible approach to managing your assets. Our platform is designed to meet the unique needs of your organization, delivering reliable and efficient asset management.",
  primary_button: {
    text: "Get Started for Free",
    link: "/contact",
  },
  secondary_button: {
    text: "Schedule a Free Demo",
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
