import PageHeroSection from "@/components/PageHeroSection";
import CmsReusableSections from "@/components/CmsReusableSections";
import ResourcePageHeroSection from "@/components/ResourcePageHeroSection";
import type { CmsPageResponse } from "@/lib/cms";
import {
  normalizePageHeroSectionData,
  type PageHeroSectionData,
} from "@/lib/page-hero-section";
import {
  normalizeResourcePageHeroSectionData,
  type ResourcePageHeroSectionData,
} from "@/lib/resource-page-hero-section";

type CmsResourcePageExperienceProps = {
  page: CmsPageResponse;
};

function getResourceHeroFromPage(page: CmsPageResponse): ResourcePageHeroSectionData | null {
  const section = page.sections.find(
    (section) => section.section_type === "resource_page_hero" && section.is_active
  );
  if (!section?.data) return null;
  return normalizeResourcePageHeroSectionData(section.data);
}

function getPageTypeLabel(pageType: string) {
  if (pageType === "resource") return "Resources";
  if (pageType === "feature") return "Features";
  if (pageType === "solution") return "Solutions";
  if (pageType === "service") return "Services";
  return pageType;
}

function getPageHeroFromPage(page: CmsPageResponse): PageHeroSectionData | null {
  const section = page.sections.find(
    (item) => item.section_type === "page_hero" && item.is_active
  );
  if (!section?.data) return null;
  return normalizePageHeroSectionData(section.data, {
    pageType: page.page.page_type,
    pageTitle: page.page.title,
  });
}

export default function CmsResourcePageExperience({ page }: CmsResourcePageExperienceProps) {
  const pageHeroData = getPageHeroFromPage(page);
  const heroData = getResourceHeroFromPage(page);

  return (
    <main className="overflow-hidden bg-white pt-[108px]">
      {pageHeroData ? (
        <PageHeroSection
          data={pageHeroData}
          context={{ pageType: page.page.page_type, pageTitle: page.page.title }}
        />
      ) : (
        <ResourcePageHeroSection
          data={
            heroData ?? {
              tagline: getPageTypeLabel(page.page.page_type),
              heading: page.page.title,
              description: "",
            }
          }
        />
      )}

      <CmsReusableSections
        sections={page.sections}
        excludeTypes={["page_hero", "resource_page_hero"]}
        pageContext={{ pageType: page.page.page_type, pageTitle: page.page.title }}
      />
    </main>
  );
}
