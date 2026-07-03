import type { Metadata } from "next";
import { generateCmsSlugMetadata, renderCmsSlugPage } from "@/lib/cms-slug-page";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  return generateCmsSlugMetadata({ params, notFoundTitle: "Blog not found" });
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  return renderCmsSlugPage({ params, pageType: "blog", notFoundTitle: "Blog not found" });
}
