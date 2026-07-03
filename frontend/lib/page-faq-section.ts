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

export const DEFAULT_PAGE_FAQ_SECTION: PageFaqSectionData = {
  tagline: "FAQ",
  heading: "Frequently Asked",
  heading_accent: "Questions",
  description:
    "Find answers to common questions about our asset management software and implementation.",
  items: [
    {
      question: "What is asset management software?",
      answer:
        "Asset management software helps organizations track, maintain, and optimize physical and digital assets across locations with real-time visibility and audit-ready records.",
    },
    {
      question: "Can this work for multiple sites and departments?",
      answer:
        "Yes. You can manage assets across plants, warehouses, offices, and remote locations from one centralized platform with role-based access.",
    },
    {
      question: "Does it support RFID, BLE, and barcode tracking?",
      answer:
        "Tag RoBo Tech supports RFID, BLE, barcode, GPS, and IoT integrations so you can choose the right tracking method for each asset type.",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Most deployments begin with a pilot in a few weeks. Full rollout timelines depend on asset volume, integrations, and site count.",
    },
  ],
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

export function mergePageFaqSectionData(
  cmsData: PageFaqSectionData | null | undefined
): PageFaqSectionData {
  if (!cmsData) return DEFAULT_PAGE_FAQ_SECTION;
  return normalizePageFaqSectionData(cmsData);
}
