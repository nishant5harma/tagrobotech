import caseStudyDefaults from "@/lib/data/case-study.json";

export type CaseStudyItem = {
  id: string;
  title: string;
  excerpt: string;
  client: string;
  industry: string;
  media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  link_text: string;
  link: string;
};

export type CaseStudySectionData = {
  tagline: string;
  heading: string;
  description: string;
  read_more_chars: number;
  items: CaseStudyItem[];
};

export const DEFAULT_CASE_STUDY_SECTION: CaseStudySectionData =
  caseStudyDefaults as CaseStudySectionData;

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

function normalizeItem(value: unknown, index: number): CaseStudyItem | null {
  const row = (value ?? {}) as Record<string, unknown>;
  const title = String(row.title ?? "").trim();
  const excerpt = String(row.excerpt ?? "").trim();
  if (!title && !excerpt) return null;

  const fallback = DEFAULT_CASE_STUDY_SECTION.items[index] ?? DEFAULT_CASE_STUDY_SECTION.items[0];

  return {
    id: String(row.id ?? fallback?.id ?? `case-study-${index + 1}`),
    title: title || fallback?.title || `Case study ${index + 1}`,
    excerpt: excerpt || fallback?.excerpt || "",
    client: String(row.client ?? fallback?.client ?? ""),
    industry: String(row.industry ?? fallback?.industry ?? ""),
    media_id: (row.media_id as string | null) ?? null,
    image_src: String(row.image_src ?? fallback?.image_src ?? ""),
    image_alt: String(row.image_alt ?? row.title ?? fallback?.image_alt ?? "Case study"),
    image_url: (row.image_url as string | null | undefined) ?? null,
    link_text: String(row.link_text ?? fallback?.link_text ?? "Read more"),
    link: String(row.link ?? fallback?.link ?? "/contact"),
  };
}

export function normalizeCaseStudySectionData(raw: unknown): CaseStudySectionData {
  const data = asRecord(raw);
  const items = Array.isArray(data.items)
    ? (data.items.map((item, index) => normalizeItem(item, index)).filter(Boolean) as CaseStudyItem[])
    : [];

  const readMore = Number(data.read_more_chars);
  return {
    tagline: String(data.tagline ?? DEFAULT_CASE_STUDY_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_CASE_STUDY_SECTION.heading),
    description: String(data.description ?? DEFAULT_CASE_STUDY_SECTION.description),
    read_more_chars:
      Number.isFinite(readMore) && readMore > 40
        ? Math.floor(readMore)
        : DEFAULT_CASE_STUDY_SECTION.read_more_chars,
    items: items.length > 0 ? items : DEFAULT_CASE_STUDY_SECTION.items.map((item) => ({ ...item })),
  };
}

export function caseStudySectionToPayload(data: CaseStudySectionData): Record<string, unknown> {
  return {
    tagline: data.tagline,
    heading: data.heading,
    description: data.description,
    read_more_chars: data.read_more_chars,
    items: data.items.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      client: item.client,
      industry: item.industry,
      media_id: item.media_id,
      image_src: item.image_src,
      image_alt: item.image_alt,
      link_text: item.link_text,
      link: item.link,
    })),
  };
}
