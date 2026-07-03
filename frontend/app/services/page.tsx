import type { Metadata } from "next";
import ServicesPageExperience from "@/components/ServicesPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import {
  getHeroSectionServicePageFromPage,
  getPublishedPage,
  getServicesCatalogueSectionServicePageFromPage,
  getServicesExecutionSectionServicePageFromPage,
  getServicesIntroSectionServicePageFromPage,
} from "@/lib/cms";
import { buildCmsMetadata } from "@/lib/cms-slug-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage(process.env.CMS_SERVICES_SLUG || "services");

  if (!page) {
    return {
      title: "Our Services | Tag RoBo Tech",
      description:
        "End-to-end enterprise asset tracking, inventory reconciliation, fleet visibility, and specialized RFID solutions from Tag RoBo Tech.",
    };
  }

  return buildCmsMetadata(page);
}

export default async function ServicesPage() {
  const page = await getPublishedPage(process.env.CMS_SERVICES_SLUG || "services");
  const heroData = getHeroSectionServicePageFromPage(page);
  const introData = getServicesIntroSectionServicePageFromPage(page);
  const catalogueData = getServicesCatalogueSectionServicePageFromPage(page);
  const executionData = getServicesExecutionSectionServicePageFromPage(page);

  return (
    <>
      <SiteNavbar />
      <ServicesPageExperience
        page={page}
        heroData={heroData}
        introData={introData}
        catalogueData={catalogueData}
        executionData={executionData}
      />
      <Footer />
    </>
  );
}
