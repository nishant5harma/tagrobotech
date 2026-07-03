import type { Metadata } from "next";
import { generateCmsSlugMetadata, renderCmsSlugPage } from "@/lib/cms-slug-page";

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  return generateCmsSlugMetadata({ params, notFoundTitle: "Solution not found" });
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  return renderCmsSlugPage({ params, pageType: "solution", notFoundTitle: "Solution not found" });
}
