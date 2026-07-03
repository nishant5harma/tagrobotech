import defaults from "@/lib/data/services-catalogue-section-service-page.json";

export type ServicesCatalogueCategory = {
  key: string;
  label: string;
};

export type ServicesCatalogueServiceItem = {
  number: string;
  category_key: string;
  category_label: string;
  summary_label: string;
  title: string;
  short_description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  link: string;
  tags: string[];
  highlights: string[];
  enquire_text: string;
  enquire_link: string;
};

export type ServicesCatalogueSectionServicePageData = {
  tagline: string;
  heading: string;
  description: string;
  categories: ServicesCatalogueCategory[];
  services: ServicesCatalogueServiceItem[];
};

export const DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE: ServicesCatalogueSectionServicePageData =
  defaults as ServicesCatalogueSectionServicePageData;

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

function normalizeCategories(value: unknown): ServicesCatalogueCategory[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.categories.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.categories[index] ??
      DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.categories[0];

    return {
      key: String(row.key ?? fallback.key),
      label: String(row.label ?? fallback.label),
    };
  });
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || value.length === 0) return [...fallback];
  return value.map((item) => String(item ?? ""));
}

function normalizeServices(value: unknown): ServicesCatalogueServiceItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.services.map((item) => ({
      ...item,
      tags: [...item.tags],
      highlights: [...item.highlights],
    }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.services[index] ??
      DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.services[0];

    return {
      number: String(row.number ?? fallback.number),
      category_key: String(row.category_key ?? fallback.category_key),
      category_label: String(row.category_label ?? fallback.category_label),
      summary_label: String(row.summary_label ?? fallback.summary_label),
      title: String(row.title ?? fallback.title),
      short_description: String(row.short_description ?? fallback.short_description),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      link: String(row.link ?? fallback.link),
      tags: normalizeStringArray(row.tags, fallback.tags),
      highlights: normalizeStringArray(row.highlights, fallback.highlights),
      enquire_text: String(row.enquire_text ?? fallback.enquire_text),
      enquire_link: String(row.enquire_link ?? fallback.enquire_link),
    };
  });
}

export function normalizeServicesCatalogueSectionServicePageData(
  raw: unknown
): ServicesCatalogueSectionServicePageData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.tagline),
    heading: String(data.heading ?? DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.heading),
    description: String(
      data.description ?? DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE.description
    ),
    categories: normalizeCategories(data.categories),
    services: normalizeServices(data.services),
  };
}

export function servicesCatalogueSectionServicePageToPayload(
  data: ServicesCatalogueSectionServicePageData
): Record<string, unknown> {
  return { ...data };
}
