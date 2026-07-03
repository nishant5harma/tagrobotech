import { resolveCmsMediaUrl } from "@/lib/cms";
import {
  TESTIMONIALS,
  TESTIMONIAL_STATS,
  type Testimonial,
} from "@/lib/testimonials";

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
  company_logo_url?: string | null;
};

export type TestimonialsSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  stats: TestimonialStat[];
  items: TestimonialItem[];
};

function defaultItems(): TestimonialItem[] {
  return TESTIMONIALS.map((item) => ({
    id: item.id,
    quote: item.quote,
    author: item.author,
    role: item.role,
    company: item.company,
    rating: item.rating,
    highlight: item.highlight ?? "",
    media_id: null,
    company_logo_src: item.companyLogo ?? "",
  }));
}

export const DEFAULT_TESTIMONIALS_SECTION: TestimonialsSectionData = {
  tagline: "Client Voices",
  heading: "What our clients",
  heading_accent: "say about us",
  description:
    "As industry pioneers, we've earned the trust of enterprise teams for reliable tracking, tailored software, and support that scales with their operations.",
  stats: TESTIMONIAL_STATS.map((stat) => ({ value: stat.value, label: stat.label })),
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
  if (!Array.isArray(value) || value.length === 0) return defaultItems();

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = defaultItems()[index] ?? {
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
      company_logo_url: row.company_logo_url ? String(row.company_logo_url) : null,
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

export function mergeTestimonialsSectionData(
  cmsData: TestimonialsSectionData | null
): TestimonialsSectionData {
  if (!cmsData) return DEFAULT_TESTIMONIALS_SECTION;
  return normalizeTestimonialsSectionData(cmsData);
}

export function toTestimonialCards(section: TestimonialsSectionData): Testimonial[] {
  return section.items.map((item) => ({
    id: item.id,
    quote: item.quote,
    author: item.author,
    role: item.role,
    company: item.company,
    rating: item.rating,
    highlight: item.highlight || undefined,
    companyLogo: item.company_logo_url
      ? resolveCmsMediaUrl(item.company_logo_url)
      : item.company_logo_src || undefined,
  }));
}
