import type { Metadata } from "next";
import ToolsPageExperience from "@/components/ToolsPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import {
  getHeroSectionToolsFromPage,
  getPublishedPage,
  getToolsCtaSectionToolsFromPage,
  getToolsFlagshipSectionToolsFromPage,
  getToolsIntroSectionToolsFromPage,
} from "@/lib/cms";
import { buildCmsMetadata } from "@/lib/cms-slug-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage(process.env.CMS_TOOLS_SLUG || "tools");

  if (!page) {
    return {
      title: "Tools | Tag RoBo Tech",
      description:
        "100+ tracking tools and technologies worldwide — drone scanning, robotic scanning, RFID readers, and mobile tag scanning from Tag RoBo Tech.",
    };
  }

  return buildCmsMetadata(page);
}

export default async function ToolsPage() {
  const page = await getPublishedPage(process.env.CMS_TOOLS_SLUG || "tools");
  const heroData = getHeroSectionToolsFromPage(page);
  const introData = getToolsIntroSectionToolsFromPage(page);
  const flagshipData = getToolsFlagshipSectionToolsFromPage(page);
  const ctaData = getToolsCtaSectionToolsFromPage(page);

  return (
    <>
      <SiteNavbar />
      <ToolsPageExperience
        page={page}
        heroData={heroData}
        introData={introData}
        flagshipData={flagshipData}
        ctaData={ctaData}
      />
      <Footer />
    </>
  );
}
