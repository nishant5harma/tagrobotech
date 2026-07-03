export type CtaReusableButton = {
  text: string;
  link: string;
};

export type CtaReusableRating = {
  value: string;
};

export type CtaReusableSectionData = {
  heading: string;
  description: string;
  button: CtaReusableButton;
  show_trust_badges: boolean;
  ratings: CtaReusableRating[];
};

export const DEFAULT_CTA_REUSABLE_SECTION: CtaReusableSectionData = {
  heading: "Book Your Consultation Now",
  description: "See how finance leaders manage their assets with Tag RoBo Tech",
  button: {
    text: "Schedule a Free Demo",
    link: "/contact",
  },
  show_trust_badges: true,
  ratings: [{ value: "4.8" }, { value: "5.0" }],
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

function normalizeButton(value: unknown, fallback: CtaReusableButton): CtaReusableButton {
  const row = (value ?? {}) as Record<string, unknown>;

  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeRatings(value: unknown): CtaReusableRating[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_CTA_REUSABLE_SECTION.ratings.map((item) => ({ ...item }));
  }

  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const rating = String(row.value ?? "").trim();
      if (!rating) return null;
      return { value: rating };
    })
    .filter(Boolean) as CtaReusableRating[];
}

export function normalizeCtaReusableSectionData(raw: unknown): CtaReusableSectionData {
  const data = asRecord(raw);

  return {
    heading: String(data.heading ?? DEFAULT_CTA_REUSABLE_SECTION.heading),
    description: String(data.description ?? DEFAULT_CTA_REUSABLE_SECTION.description),
    button: normalizeButton(data.button, DEFAULT_CTA_REUSABLE_SECTION.button),
    show_trust_badges:
      typeof data.show_trust_badges === "boolean"
        ? data.show_trust_badges
        : DEFAULT_CTA_REUSABLE_SECTION.show_trust_badges,
    ratings: normalizeRatings(data.ratings),
  };
}

export function mergeCtaReusableSectionData(
  cmsData: CtaReusableSectionData | null | undefined
): CtaReusableSectionData {
  if (!cmsData) return DEFAULT_CTA_REUSABLE_SECTION;
  return normalizeCtaReusableSectionData(cmsData);
}
