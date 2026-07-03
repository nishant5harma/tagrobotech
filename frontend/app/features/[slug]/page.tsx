import type { Metadata } from "next";
import { generateCmsSlugMetadata, renderCmsSlugPage } from "@/lib/cms-slug-page";

type FeaturePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  return generateCmsSlugMetadata({ params, notFoundTitle: "Feature not found" });
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  return renderCmsSlugPage({ params, pageType: "feature", notFoundTitle: "Feature not found" });
}
