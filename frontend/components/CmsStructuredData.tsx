import type { CmsPageResponse } from "@/lib/cms";

type CmsStructuredDataProps = {
  page: CmsPageResponse;
};

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function getPublicUrl(page: CmsPageResponse["page"]) {
  const cleanSlug = page.slug.replace(/^\//, "");
  if (page.page_type === "resource") return `${getSiteUrl()}/resources/${cleanSlug}`;
  if (page.page_type === "feature") return `${getSiteUrl()}/features/${cleanSlug}`;
  if (page.page_type === "solution") return `${getSiteUrl()}/solutions/${cleanSlug}`;
  if (page.page_type === "service") return `${getSiteUrl()}/services/${cleanSlug}`;
  if (page.page_type === "blog") return `${getSiteUrl()}/blog/${cleanSlug}`;
  if (page.page_type === "case_study") return `${getSiteUrl()}/case-studies/${cleanSlug}`;
  return `${getSiteUrl()}${page.slug === "/" ? "" : `/${cleanSlug}`}`;
}

function buildDefaultSchema(page: CmsPageResponse) {
  if (page.page.page_type === "blog") {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: page.page.title,
      description: page.page.excerpt || page.page.title,
      datePublished: page.page.published_at || undefined,
      author: page.page.author_name ? { "@type": "Person", name: page.page.author_name } : undefined,
      image: page.page.featured_image_url || undefined,
      mainEntityOfPage: getPublicUrl(page.page),
    };
  }

  if (page.page.page_type === "case_study") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.page.title,
      description: page.page.excerpt || page.page.title,
      datePublished: page.page.published_at || undefined,
      about: page.page.industry || undefined,
      image: page.page.featured_image_url || undefined,
      mainEntityOfPage: getPublicUrl(page.page),
    };
  }

  return null;
}

export default function CmsStructuredData({ page }: CmsStructuredDataProps) {
  const seo = (page.seo ?? {}) as Record<string, unknown>;
  const schema = seo.schema_json ?? buildDefaultSchema(page);

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
