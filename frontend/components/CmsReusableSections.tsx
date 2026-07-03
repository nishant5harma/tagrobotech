import PageHeroSection from "@/components/PageHeroSection";
import PageClientsSection from "@/components/PageClientsSection";
import AssetManagementSolutionSection from "@/components/AssetManagementSolutionSection";
import PageFaqSection from "@/components/PageFaqSection";
import PageCtaSection from "@/components/PageCtaSection";
import CtaReusableSection from "@/components/CtaReusableSection";
import HeroSectionServicePage from "@/components/HeroSectionServicePage";
import ServicesIntroSectionServicePage from "@/components/ServicesIntroSectionServicePage";
import ServicesCatalogueSectionServicePage from "@/components/ServicesCatalogueSectionServicePage";
import ServicesExecutionSectionServicePage from "@/components/ServicesExecutionSectionServicePage";
import HeroSectionTools from "@/components/HeroSectionTools";
import ToolsIntroSectionTools from "@/components/ToolsIntroSectionTools";
import ToolsFlagshipSectionTools from "@/components/ToolsFlagshipSectionTools";
import ToolsCtaSectionTools from "@/components/ToolsCtaSectionTools";
import HeroSectionSoftware from "@/components/HeroSectionSoftware";
import SoftwareIntroSectionSoftware from "@/components/SoftwareIntroSectionSoftware";
import SoftwareModulesSectionSoftware from "@/components/SoftwareModulesSectionSoftware";
import SoftwareCtaSectionSoftware from "@/components/SoftwareCtaSectionSoftware";
import ArticleBodySection from "@/components/ArticleBodySection";
import RichTextSection from "@/components/RichTextSection";
import type { CmsPageSection } from "@/lib/cms";
import { normalizeAssetManagementSolutionSectionData } from "@/lib/asset-management-solution-section";
import { normalizeArticleBodySectionData } from "@/lib/article-body-section";
import { normalizePageClientsSectionData } from "@/lib/page-clients-section";
import { normalizePageCtaSectionData } from "@/lib/page-cta-section";
import { normalizeCtaReusableSectionData } from "@/lib/cta-reusable-section";
import { normalizePageFaqSectionData } from "@/lib/page-faq-section";
import { normalizePageHeroSectionData } from "@/lib/page-hero-section";
import { normalizeHeroSectionServicePageData } from "@/lib/hero-section-service-page";
import { normalizeServicesIntroSectionServicePageData } from "@/lib/services-intro-section-service-page";
import { normalizeServicesCatalogueSectionServicePageData } from "@/lib/services-catalogue-section-service-page";
import { normalizeServicesExecutionSectionServicePageData } from "@/lib/services-execution-section-service-page";
import { normalizeHeroSectionToolsData } from "@/lib/hero-section-tools";
import { normalizeToolsIntroSectionToolsData } from "@/lib/tools-intro-section-tools";
import { normalizeToolsFlagshipSectionToolsData } from "@/lib/tools-flagship-section-tools";
import { normalizeToolsCtaSectionToolsData } from "@/lib/tools-cta-section-tools";
import { normalizeHeroSectionSoftwareData } from "@/lib/hero-section-software";
import { normalizeSoftwareIntroSectionSoftwareData } from "@/lib/software-intro-section-software";
import { normalizeSoftwareModulesSectionSoftwareData } from "@/lib/software-modules-section-software";
import { normalizeSoftwareCtaSectionSoftwareData } from "@/lib/software-cta-section-software";

type CmsReusableSectionsProps = {
  sections: CmsPageSection[];
  excludeTypes?: string[];
  pageContext?: {
    pageType: string;
    pageTitle: string;
  };
};

function isSectionActive(section: CmsPageSection) {
  return section.is_active === true || section.is_active === 1;
}

function renderSection(
  section: CmsPageSection,
  pageContext?: CmsReusableSectionsProps["pageContext"]
) {
  if (section.section_type === "page_hero") {
    return (
      <PageHeroSection
        data={normalizePageHeroSectionData(section.data, {
          pageType: pageContext?.pageType ?? "page",
          pageTitle: pageContext?.pageTitle ?? "",
        })}
      />
    );
  }

  if (section.section_type === "page_clients") {
    return <PageClientsSection data={normalizePageClientsSectionData(section.data)} />;
  }

  if (section.section_type === "asset_management_solution") {
    return (
      <AssetManagementSolutionSection
        data={normalizeAssetManagementSolutionSectionData(section.data)}
      />
    );
  }

  if (section.section_type === "page_faq") {
    return <PageFaqSection data={normalizePageFaqSectionData(section.data)} />;
  }

  if (section.section_type === "page_cta") {
    return <PageCtaSection data={normalizePageCtaSectionData(section.data)} />;
  }

  if (section.section_type === "cta_reusable") {
    return <CtaReusableSection data={normalizeCtaReusableSectionData(section.data)} />;
  }

  if (section.section_type === "hero_section_service_page") {
    return <HeroSectionServicePage data={normalizeHeroSectionServicePageData(section.data)} />;
  }

  if (section.section_type === "services_intro_section_service_page") {
    return (
      <ServicesIntroSectionServicePage
        data={normalizeServicesIntroSectionServicePageData(section.data)}
      />
    );
  }

  if (section.section_type === "services_catalogue_section_service_page") {
    return (
      <ServicesCatalogueSectionServicePage
        data={normalizeServicesCatalogueSectionServicePageData(section.data)}
      />
    );
  }

  if (section.section_type === "services_execution_section_service_page") {
    return (
      <ServicesExecutionSectionServicePage
        data={normalizeServicesExecutionSectionServicePageData(section.data)}
      />
    );
  }

  if (section.section_type === "hero_section_tools") {
    return <HeroSectionTools data={normalizeHeroSectionToolsData(section.data)} />;
  }

  if (section.section_type === "tools_intro_section_tools") {
    return (
      <ToolsIntroSectionTools data={normalizeToolsIntroSectionToolsData(section.data)} />
    );
  }

  if (section.section_type === "tools_flagship_section_tools") {
    return (
      <ToolsFlagshipSectionTools
        data={normalizeToolsFlagshipSectionToolsData(section.data)}
      />
    );
  }

  if (section.section_type === "tools_cta_section_tools") {
    return <ToolsCtaSectionTools data={normalizeToolsCtaSectionToolsData(section.data)} />;
  }

  if (section.section_type === "hero_section_software") {
    return <HeroSectionSoftware data={normalizeHeroSectionSoftwareData(section.data)} />;
  }

  if (section.section_type === "software_intro_section_software") {
    return (
      <SoftwareIntroSectionSoftware
        data={normalizeSoftwareIntroSectionSoftwareData(section.data)}
      />
    );
  }

  if (section.section_type === "software_modules_section_software") {
    return (
      <SoftwareModulesSectionSoftware
        data={normalizeSoftwareModulesSectionSoftwareData(section.data)}
      />
    );
  }

  if (section.section_type === "software_cta_section_software") {
    return (
      <SoftwareCtaSectionSoftware data={normalizeSoftwareCtaSectionSoftwareData(section.data)} />
    );
  }

  if (section.section_type === "article_body") {
    return <ArticleBodySection data={normalizeArticleBodySectionData(section.data)} />;
  }

  if (section.section_type === "rich_text") {
    return <RichTextSection data={section.data} />;
  }

  return null;
}

export default function CmsReusableSections({
  sections,
  excludeTypes = [],
  pageContext,
}: CmsReusableSectionsProps) {
  const excluded = new Set(excludeTypes);

  return [...sections]
    .sort((a, b) => a.position - b.position)
    .map((section) => {
      if (!isSectionActive(section)) return null;
      if (excluded.has(section.section_type)) return null;

      const content = renderSection(section, pageContext);
      if (!content) return null;

      return <div key={section.id}>{content}</div>;
    });
}
