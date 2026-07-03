import type { Metadata } from "next";
import SoftwarePageExperience from "@/components/SoftwarePageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import {
  getHeroSectionSoftwareFromPage,
  getPublishedPage,
  getSoftwareCtaSectionSoftwareFromPage,
  getSoftwareIntroSectionSoftwareFromPage,
  getSoftwareModulesSectionSoftwareFromPage,
} from "@/lib/cms";
import { buildCmsMetadata } from "@/lib/cms-slug-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage(process.env.CMS_SOFTWARE_SLUG || "software");

  if (!page) {
    return {
      title: "Footprints Software | Tag RoBo Tech",
      description:
        "Footprints — Tag RoBo Tech in-house asset tracking software customised per client with 9 modules and ERP integration via API.",
    };
  }

  return buildCmsMetadata(page);
}

export default async function SoftwarePage() {
  const page = await getPublishedPage(process.env.CMS_SOFTWARE_SLUG || "software");
  const heroData = getHeroSectionSoftwareFromPage(page);
  const introData = getSoftwareIntroSectionSoftwareFromPage(page);
  const modulesData = getSoftwareModulesSectionSoftwareFromPage(page);
  const ctaData = getSoftwareCtaSectionSoftwareFromPage(page);

  return (
    <>
      <SiteNavbar />
      <SoftwarePageExperience
        page={page}
        heroData={heroData}
        introData={introData}
        modulesData={modulesData}
        ctaData={ctaData}
      />
      <Footer />
    </>
  );
}
