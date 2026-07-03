import type { Metadata } from "next";
import { generateCmsSlugMetadata, renderCmsSlugPage } from "@/lib/cms-slug-page";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  return generateCmsSlugMetadata({ params, notFoundTitle: "Case study not found" });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  return renderCmsSlugPage({
    params,
    pageType: "case_study",
    notFoundTitle: "Case study not found",
  });
}
