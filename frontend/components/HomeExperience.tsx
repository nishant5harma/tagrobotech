import HeroSection from "@/components/HeroSection";
import SiteNavbar from "@/components/SiteNavbar";
import ConnectSpecialistBar from "@/components/ConnectSpecialistBar";
import FootprintsSection from "@/components/FootprintsSection";
import IndustriesSection from "@/components/IndustriesSection";
import TrackSection from "@/components/TrackSection";
import RobotSplineSection from "@/components/RobotSplineSection";
import TechnologyPlatformsSection from "@/components/TechnologyPlatformsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import OurClientsSection from "@/components/OurClientsSection";
import CmsReusableSections from "@/components/CmsReusableSections";
import Footer from "@/components/Footer";
import type { CmsPageSection } from "@/lib/cms";
import type { HeroSectionData } from "@/lib/hero";
import type { ClientCarouselData } from "@/lib/cms";
import type { AboutSectionData } from "@/lib/about-section";
import type { TrackSectionData } from "@/lib/track-section";
import type { TechnologyPlatformSectionData } from "@/lib/technology-platform";
import type { TrustedIndustriesSectionData } from "@/lib/trusted-industries";
import type { FootprintsSectionData } from "@/lib/footprints-section";
import type { TestimonialsSectionData } from "@/lib/testimonials-section";
import type { MoreClientsSectionData } from "@/lib/more-clients-section";

const HOME_SECTION_TYPES = [
  "hero",
  "clients",
  "about",
  "track",
  "technology_platform",
  "trusted_industries",
  "footprints",
  "testimonials",
  "more_clients",
] as const;

type HomeExperienceProps = {
  heroData?: HeroSectionData | null;
  clientsData?: ClientCarouselData | null;
  aboutData?: AboutSectionData | null;
  trackData?: TrackSectionData | null;
  technologyPlatformData?: TechnologyPlatformSectionData | null;
  trustedIndustriesData?: TrustedIndustriesSectionData | null;
  footprintsData?: FootprintsSectionData | null;
  testimonialsData?: TestimonialsSectionData | null;
  moreClientsData?: MoreClientsSectionData | null;
  sections?: CmsPageSection[];
  pageTitle?: string;
};

export default function HomeExperience({
  heroData,
  clientsData,
  aboutData,
  trackData,
  technologyPlatformData,
  trustedIndustriesData,
  footprintsData,
  testimonialsData,
  moreClientsData,
  sections = [],
  pageTitle = "Home",
}: HomeExperienceProps) {
  return (
    <>
      <SiteNavbar />
      <HeroSection data={heroData} clients={clientsData} />
      <RobotSplineSection data={aboutData} />
      <ConnectSpecialistBar />
      <TrackSection data={trackData} />
      <TechnologyPlatformsSection data={technologyPlatformData} />
      <IndustriesSection data={trustedIndustriesData} />
      <FootprintsSection data={footprintsData} />
      <TestimonialsSection data={testimonialsData} />
      <OurClientsSection data={moreClientsData} />
      <CmsReusableSections
        sections={sections}
        excludeTypes={[...HOME_SECTION_TYPES]}
        pageContext={{ pageType: "home", pageTitle }}
      />
      <Footer />
    </>
  );
}
