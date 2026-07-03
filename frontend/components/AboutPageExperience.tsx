"use client";

import AboutPageHeroSection from "@/components/AboutPageHeroSection";
import WhoWeAreAboutSection from "@/components/WhoWeAreAboutSection";
import OurJourneyAboutSection from "@/components/OurJourneyAboutSection";
import WhatWeDeliverAboutSection from "@/components/WhatWeDeliverAboutSection";
import ReachTrustAboutSection from "@/components/ReachTrustAboutSection";
import type { AboutPageHeroSectionData } from "@/lib/about-page-hero-section";
import type { WhoWeAreAboutSectionData } from "@/lib/who-we-are-about-section";
import type { OurJourneyAboutSectionData } from "@/lib/our-journey-about-section";
import type { WhatWeDeliverAboutSectionData } from "@/lib/what-we-deliver-about-section";
import type { ReachTrustAboutSectionData } from "@/lib/reach-trust-about-section";

export default function AboutPageExperience({
  heroData,
  whoWeAreData,
  ourJourneyData,
  whatWeDeliverData,
  reachTrustData,
}: {
  heroData?: AboutPageHeroSectionData | null;
  whoWeAreData?: WhoWeAreAboutSectionData | null;
  ourJourneyData?: OurJourneyAboutSectionData | null;
  whatWeDeliverData?: WhatWeDeliverAboutSectionData | null;
  reachTrustData?: ReachTrustAboutSectionData | null;
}) {
  return (
    <main className="overflow-hidden bg-white pt-[108px]">
      <AboutPageHeroSection data={heroData} />

      <WhoWeAreAboutSection data={whoWeAreData} />

      <OurJourneyAboutSection data={ourJourneyData} />

      <WhatWeDeliverAboutSection data={whatWeDeliverData} />

      <ReachTrustAboutSection data={reachTrustData} />
    </main>
  );
}
