import type { Metadata } from "next";
import AboutPageExperience from "@/components/AboutPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getAboutPageHeroSectionFromPage, getPublishedPage, getWhoWeAreAboutSectionFromPage, getOurJourneyAboutSectionFromPage, getWhatWeDeliverAboutSectionFromPage, getReachTrustAboutSectionFromPage } from "@/lib/cms";
import { getMetadataForStaticSlug } from "@/lib/cms-slug-page";

export async function generateMetadata(): Promise<Metadata> {
  return getMetadataForStaticSlug(process.env.CMS_ABOUT_SLUG || "about", {
    title: "About Us | Tag RoBo Tech",
    description:
      "Learn about Tag RoBo Tech, our 13-year journey, tracking expertise, robotics-led execution, ERP integration, and the global client network we serve.",
  });
}

export default async function AboutPage() {
  const page = await getPublishedPage(process.env.CMS_ABOUT_SLUG || "about");
  const heroData = getAboutPageHeroSectionFromPage(page);
  const whoWeAreData = getWhoWeAreAboutSectionFromPage(page);
  const ourJourneyData = getOurJourneyAboutSectionFromPage(page);
  const whatWeDeliverData = getWhatWeDeliverAboutSectionFromPage(page);
  const reachTrustData = getReachTrustAboutSectionFromPage(page);

  return (
    <>
      <SiteNavbar />
      <AboutPageExperience
        heroData={heroData}
        whoWeAreData={whoWeAreData}
        ourJourneyData={ourJourneyData}
        whatWeDeliverData={whatWeDeliverData}
        reachTrustData={reachTrustData}
      />
      <Footer />
    </>
  );
}
