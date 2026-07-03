import type { Metadata } from "next";
import ContentArchivePage from "@/components/ContentArchivePage";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getPublishedContentList } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Case Studies | Tag RoBo Tech",
  description:
    "See how Tag RoBo Tech helps enterprises improve visibility, compliance, and efficiency with tracking solutions.",
};

export default async function CaseStudiesPage() {
  const items = await getPublishedContentList("case_study", { limit: 24 });

  return (
    <>
      <SiteNavbar />
      <ContentArchivePage
        title="Case Studies"
        description="Real-world implementations, outcomes, and lessons from Tag RoBo Tech deployments."
        eyebrow="Case Studies"
        items={items}
        basePath="/case-studies"
      />
      <Footer />
    </>
  );
}
