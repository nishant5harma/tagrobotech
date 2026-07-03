import type { Metadata } from "next";
import ContentArchivePage from "@/components/ContentArchivePage";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getPublishedContentList } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog | Tag RoBo Tech",
  description:
    "Insights, guides, and updates on RFID, asset tracking, IoT, and enterprise operations from Tag RoBo Tech.",
};

export default async function BlogPage() {
  const items = await getPublishedContentList("blog", { limit: 24 });

  return (
    <>
      <SiteNavbar />
      <ContentArchivePage
        title="Blog & Insights"
        description="Explore practical articles on RFID, BLE, IoT, asset management, and operational intelligence."
        eyebrow="Blog"
        items={items}
        basePath="/blog"
      />
      <Footer />
    </>
  );
}
