import HomeExperience from "@/components/HomeExperience";
import {
  getAboutSectionFromPage,
  getClientsSectionFromPage,
  getHeroSectionFromPage,
  getPublishedPage,
  getTrackSectionFromPage,
  getTechnologyPlatformSectionFromPage,
  getTrustedIndustriesSectionFromPage,
  getFootprintsSectionFromPage,
  getTestimonialsSectionFromPage,
  getMoreClientsSectionFromPage,
  toClientCarouselData,
} from "@/lib/cms";

export default async function Home() {
  const page = await getPublishedPage(process.env.CMS_HOME_SLUG || "/");
  const heroData = getHeroSectionFromPage(page);
  const clientsData = toClientCarouselData(getClientsSectionFromPage(page));
  const aboutData = getAboutSectionFromPage(page);
  const trackData = getTrackSectionFromPage(page);
  const technologyPlatformData = getTechnologyPlatformSectionFromPage(page);
  const trustedIndustriesData = getTrustedIndustriesSectionFromPage(page);
  const footprintsData = getFootprintsSectionFromPage(page);
  const testimonialsData = getTestimonialsSectionFromPage(page);
  const moreClientsData = getMoreClientsSectionFromPage(page);

  return (
    <HomeExperience
      heroData={heroData}
      clientsData={clientsData}
      aboutData={aboutData}
      trackData={trackData}
      technologyPlatformData={technologyPlatformData}
      trustedIndustriesData={trustedIndustriesData}
      footprintsData={footprintsData}
      testimonialsData={testimonialsData}
      moreClientsData={moreClientsData}
      sections={page?.sections ?? []}
      pageTitle={page?.page.title ?? "Home"}
    />
  );
}
