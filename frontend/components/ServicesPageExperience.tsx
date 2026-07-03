"use client";

import HeroSectionServicePage from "@/components/HeroSectionServicePage";
import ServicesIntroSectionServicePage from "@/components/ServicesIntroSectionServicePage";
import ServicesCatalogueSectionServicePage from "@/components/ServicesCatalogueSectionServicePage";
import ServicesExecutionSectionServicePage from "@/components/ServicesExecutionSectionServicePage";
import CmsReusableSections from "@/components/CmsReusableSections";
import type { CmsPageResponse } from "@/lib/cms";
import type { HeroSectionServicePageData } from "@/lib/hero-section-service-page";
import type { ServicesIntroSectionServicePageData } from "@/lib/services-intro-section-service-page";
import type { ServicesCatalogueSectionServicePageData } from "@/lib/services-catalogue-section-service-page";
import type { ServicesExecutionSectionServicePageData } from "@/lib/services-execution-section-service-page";

type ServicesPageExperienceProps = {
  page?: CmsPageResponse | null;
  heroData?: HeroSectionServicePageData | null;
  introData?: ServicesIntroSectionServicePageData | null;
  catalogueData?: ServicesCatalogueSectionServicePageData | null;
  executionData?: ServicesExecutionSectionServicePageData | null;
};

const SERVICE_SECTION_TYPES = new Set([
  "hero_section_service_page",
  "services_intro_section_service_page",
  "services_catalogue_section_service_page",
  "services_execution_section_service_page",
]);

export default function ServicesPageExperience({
  page,
  heroData,
  introData,
  catalogueData,
  executionData,
}: ServicesPageExperienceProps) {
  const reusableSections = page?.sections.filter(
    (section) => !SERVICE_SECTION_TYPES.has(section.section_type)
  );

  return (
    <main className="overflow-hidden bg-white pt-[108px]">
      <HeroSectionServicePage data={heroData} />
      <ServicesIntroSectionServicePage data={introData} />
      <ServicesCatalogueSectionServicePage data={catalogueData} />
      <ServicesExecutionSectionServicePage data={executionData} />

      {reusableSections && reusableSections.length > 0 ? (
        <CmsReusableSections
          sections={reusableSections}
          pageContext={{
            pageType: page?.page.page_type ?? "service",
            pageTitle: page?.page.title ?? "Services",
          }}
        />
      ) : null}
    </main>
  );
}
