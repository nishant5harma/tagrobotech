import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsEditorialPageExperience from "@/components/CmsEditorialPageExperience";
import CmsResourcePageExperience from "@/components/CmsResourcePageExperience";
import CmsStructuredData from "@/components/CmsStructuredData";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getPublishedPage } from "@/lib/cms";

type CmsSlugPageProps = {
  params: Promise<{ slug: string }>;
  pageType: "resource" | "feature" | "solution" | "service" | "blog" | "case_study";
  notFoundTitle: string;
};

function getPublicPath(page: {
  slug: string;
  page_type: string;
}) {
  const cleanSlug = page.slug.replace(/^\//, "");
  if (page.page_type === "resource") return `/resources/${cleanSlug}`;
  if (page.page_type === "feature") return `/features/${cleanSlug}`;
  if (page.page_type === "solution") return `/solutions/${cleanSlug}`;
  if (page.page_type === "service") return `/services/${cleanSlug}`;
  if (page.page_type === "blog") return `/blog/${cleanSlug}`;
  if (page.page_type === "case_study") return `/case-studies/${cleanSlug}`;
  return page.slug === "/" ? "/" : `/${cleanSlug}`;
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function buildCmsMetadata(page: NonNullable<Awaited<ReturnType<typeof getPublishedPage>>>): Metadata {
  const seo = (page.seo ?? {}) as Record<string, unknown>;
  const title = String(seo.meta_title || page.page.title);
  const description = String(seo.meta_description || page.page.excerpt || page.page.title);
  const canonicalPath = getPublicPath(page.page);
  const canonicalUrl = String(seo.canonical_url || `${getSiteUrl()}${canonicalPath}`);
  const ogTitle = String(seo.og_title || title);
  const ogDescription = String(seo.og_description || description);
  const ogImageUrl = String(
    seo.og_image_url || page.page.featured_image_url || ""
  );
  const robots = String(seo.robots || "index,follow");
  const metadata: Metadata = {
    title: `${title} | Tag RoBo Tech`,
    description,
    alternates: { canonical: canonicalUrl },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: page.page.page_type === "blog" ? "article" : "website",
      url: canonicalUrl,
      images: ogImageUrl
        ? [{ url: ogImageUrl, alt: String(seo.og_image_alt || page.page.title) }]
        : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };

  return metadata;
}

export async function generateCmsSlugMetadata({
  params,
  notFoundTitle,
}: Pick<CmsSlugPageProps, "params" | "notFoundTitle">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  if (!page) {
    return { title: `${notFoundTitle} | Tag RoBo Tech` };
  }

  return buildCmsMetadata(page);
}

export async function renderCmsSlugPage({ params, pageType }: CmsSlugPageProps) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  if (!page || page.page.page_type !== pageType) {
    notFound();
  }

  return (
    <>
      <SiteNavbar />
      <CmsStructuredData page={page} />
      {pageType === "blog" || pageType === "case_study" ? (
        <CmsEditorialPageExperience page={page} />
      ) : (
        <CmsResourcePageExperience page={page} />
      )}
      <Footer />
    </>
  );
}
