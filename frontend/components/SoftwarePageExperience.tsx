"use client";

import HeroSectionSoftware from "@/components/HeroSectionSoftware";
import SoftwareIntroSectionSoftware from "@/components/SoftwareIntroSectionSoftware";
import SoftwareModulesSectionSoftware from "@/components/SoftwareModulesSectionSoftware";
import SoftwareCtaSectionSoftware from "@/components/SoftwareCtaSectionSoftware";
import CmsReusableSections from "@/components/CmsReusableSections";
import type { CmsPageResponse } from "@/lib/cms";
import type { HeroSectionSoftwareData } from "@/lib/hero-section-software";
import type { SoftwareIntroSectionSoftwareData } from "@/lib/software-intro-section-software";
import type { SoftwareModulesSectionSoftwareData } from "@/lib/software-modules-section-software";
import type { SoftwareCtaSectionSoftwareData } from "@/lib/software-cta-section-software";

type SoftwarePageExperienceProps = {
  page?: CmsPageResponse | null;
  heroData?: HeroSectionSoftwareData | null;
  introData?: SoftwareIntroSectionSoftwareData | null;
  modulesData?: SoftwareModulesSectionSoftwareData | null;
  ctaData?: SoftwareCtaSectionSoftwareData | null;
};

const SOFTWARE_SECTION_TYPES = new Set([
  "hero_section_software",
  "software_intro_section_software",
  "software_modules_section_software",
  "software_cta_section_software",
]);

export default function SoftwarePageExperience({
  page,
  heroData,
  introData,
  modulesData,
  ctaData,
}: SoftwarePageExperienceProps) {
  const reusableSections = page?.sections.filter(
    (section) => !SOFTWARE_SECTION_TYPES.has(section.section_type)
  );

  return (
    <main className="overflow-hidden bg-white pt-[108px]">
      <HeroSectionSoftware data={heroData} />
      <SoftwareIntroSectionSoftware data={introData} />
      <SoftwareModulesSectionSoftware data={modulesData} />
      <SoftwareCtaSectionSoftware data={ctaData} />

      {reusableSections && reusableSections.length > 0 ? (
        <CmsReusableSections
          sections={reusableSections}
          pageContext={{
            pageType: page?.page.page_type ?? "page",
            pageTitle: page?.page.title ?? "Software",
          }}
        />
      ) : null}
    </main>
  );
}
