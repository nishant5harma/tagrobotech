import pageCtaDefaults from "@/lib/data/page-cta.json";

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

export const DEFAULT_PAGE_CTA_SECTION: PageCtaSectionData =
  pageCtaDefaults as PageCtaSectionData;

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

export function pageCtaSectionToPayload(data: PageCtaSectionData): Record<string, unknown> {
  return { ...data };
}
