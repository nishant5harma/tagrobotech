import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsStructuredData from "@/components/CmsStructuredData";
import CmsResourcePageExperience from "@/components/CmsResourcePageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getPublishedPage } from "@/lib/cms";
import { buildCmsMetadata } from "@/lib/cms-slug-page";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  if (!page) {
    return { title: "Resource not found | Tag RoBo Tech" };
  }

  return buildCmsMetadata(page);
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  if (!page || page.page.page_type !== "resource") {
    notFound();
  }

  return (
    <>
      <SiteNavbar />
      <CmsStructuredData page={page} />
      <CmsResourcePageExperience page={page} />
      <Footer />
    </>
  );
}
