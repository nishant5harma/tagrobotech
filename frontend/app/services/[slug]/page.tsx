import type { Metadata } from "next";
import { generateCmsSlugMetadata, renderCmsSlugPage } from "@/lib/cms-slug-page";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  return generateCmsSlugMetadata({ params, notFoundTitle: "Service not found" });
}

export default async function ServicePage({ params }: ServicePageProps) {
  return renderCmsSlugPage({ params, pageType: "service", notFoundTitle: "Service not found" });
}
