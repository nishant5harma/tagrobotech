import testimonialsDefaults from "@/lib/data/testimonials.json";

export type TestimonialStat = {
  value: string;
  label: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  highlight: string;
  media_id: string | null;
  company_logo_src: string;
};

export type TestimonialsSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  stats: TestimonialStat[];
  items: TestimonialItem[];
};

export const DEFAULT_TESTIMONIALS_SECTION: TestimonialsSectionData =
  testimonialsDefaults as TestimonialsSectionData;

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

function asStats(value: unknown): TestimonialStat[] {
  if (!Array.isArray(value)) return [...DEFAULT_TESTIMONIALS_SECTION.stats];
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TESTIMONIALS_SECTION.stats[index] ?? { value: "", label: "" };
    return {
      value: String(row.value ?? fallback.value),
      label: String(row.label ?? fallback.label),
    };
  });
}

function asItems(value: unknown): TestimonialItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_TESTIMONIALS_SECTION.items];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TESTIMONIALS_SECTION.items[index] ?? {
      id: `testimonial-${index + 1}`,
      quote: "",
      author: "",
      role: "",
      company: "",
      rating: 5,
      highlight: "",
      media_id: null,
      company_logo_src: "",
    };

    const rating = Number(row.rating ?? fallback.rating);

    return {
      id: String(row.id ?? fallback.id),
      quote: String(row.quote ?? fallback.quote),
      author: String(row.author ?? fallback.author),
      role: String(row.role ?? fallback.role),
      company: String(row.company ?? fallback.company),
      rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
      highlight: String(row.highlight ?? fallback.highlight),
      media_id: row.media_id ? String(row.media_id) : null,
      company_logo_src: String(row.company_logo_src ?? fallback.company_logo_src),
    };
  });
}

export function normalizeTestimonialsSectionData(raw: unknown): TestimonialsSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_TESTIMONIALS_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_TESTIMONIALS_SECTION.heading),
    heading_accent: String(data.heading_accent ?? DEFAULT_TESTIMONIALS_SECTION.heading_accent),
    description: String(data.description ?? DEFAULT_TESTIMONIALS_SECTION.description),
    stats: asStats(data.stats),
    items: asItems(data.items),
  };
}

export function testimonialsSectionToPayload(data: TestimonialsSectionData): Record<string, unknown> {
  return { ...data };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createTestimonialId(company: string, index: number) {
  const slug = slugify(company);
  return slug || `testimonial-${index + 1}`;
}
