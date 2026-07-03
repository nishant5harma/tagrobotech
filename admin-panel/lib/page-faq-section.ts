import pageFaqDefaults from "@/lib/data/page-faq.json";

export type PageFaqItem = {
  question: string;
  answer: string;
};

export type PageFaqSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: PageFaqItem[];
};

export const DEFAULT_PAGE_FAQ_SECTION: PageFaqSectionData =
  pageFaqDefaults as PageFaqSectionData;

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

function normalizeItems(value: unknown): PageFaqItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PAGE_FAQ_SECTION.items.map((item) => ({ ...item }));
  }

  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const question = String(row.question ?? "").trim();
      if (!question) return null;

      return {
        question,
        answer: String(row.answer ?? ""),
      };
    })
    .filter(Boolean) as PageFaqItem[];
}

export function normalizePageFaqSectionData(raw: unknown): PageFaqSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_PAGE_FAQ_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_PAGE_FAQ_SECTION.heading),
    heading_accent: String(data.heading_accent ?? DEFAULT_PAGE_FAQ_SECTION.heading_accent),
    description: String(data.description ?? DEFAULT_PAGE_FAQ_SECTION.description),
    items: normalizeItems(data.items),
  };
}

export function pageFaqSectionToPayload(data: PageFaqSectionData): Record<string, unknown> {
  return { ...data };
}
