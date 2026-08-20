import { notFound } from "next/navigation";
import PageHeroSection from "@/components/PageHeroSection";
import PageHeroSimpleSection from "@/components/PageHeroSimpleSection";
import PageClientsSection from "@/components/PageClientsSection";
import AssetManagementSolutionSection from "@/components/AssetManagementSolutionSection";
import PageFaqSection from "@/components/PageFaqSection";
import PageCtaSection from "@/components/PageCtaSection";
import CtaReusableSection from "@/components/CtaReusableSection";
import RichTextSection from "@/components/RichTextSection";
import ResourceBenefitsSection from "@/components/ResourceBenefitsSection";
import ResourceHowItWorksSection from "@/components/ResourceHowItWorksSection";
import ResourceToolWorkspaceSection from "@/components/ResourceToolWorkspaceSection";
import FeatureCapabilitiesSection from "@/components/FeatureCapabilitiesSection";
import FeatureWorkflowSection from "@/components/FeatureWorkflowSection";
import FeatureOverviewSection from "@/components/FeatureOverviewSection";
import FeatureUseCasesSection from "@/components/FeatureUseCasesSection";
import FeatureOutcomesSection from "@/components/FeatureOutcomesSection";
import CaseStudySection from "@/components/CaseStudySection";
import { DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION } from "@/lib/asset-management-solution-section";
import { DEFAULT_PAGE_FAQ_SECTION } from "@/lib/page-faq-section";
import { DEFAULT_PAGE_CTA_SECTION } from "@/lib/page-cta-section";
import { DEFAULT_CTA_REUSABLE_SECTION } from "@/lib/cta-reusable-section";
import { DEFAULT_PAGE_HERO_SECTION } from "@/lib/page-hero-section";
import { DEFAULT_PAGE_HERO_SIMPLE_SECTION } from "@/lib/page-hero-simple-section";
import { DEFAULT_PAGE_CLIENTS_SECTION } from "@/lib/page-clients-section";
import { DEFAULT_RESOURCE_BENEFITS_SECTION } from "@/lib/resource-benefits-section";
import { DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION } from "@/lib/resource-how-it-works-section";
import { DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION } from "@/lib/resource-tool-workspace-section";
import { DEFAULT_FEATURE_CAPABILITIES_SECTION } from "@/lib/feature-capabilities-section";
import { DEFAULT_FEATURE_WORKFLOW_SECTION } from "@/lib/feature-workflow-section";
import { DEFAULT_FEATURE_OVERVIEW_SECTION } from "@/lib/feature-overview-section";
import { DEFAULT_FEATURE_USE_CASES_SECTION } from "@/lib/feature-use-cases-section";
import { DEFAULT_FEATURE_OUTCOMES_SECTION } from "@/lib/feature-outcomes-section";
import { DEFAULT_CASE_STUDY_SECTION } from "@/lib/case-study-section";
import HeroSectionServicePage from "@/components/HeroSectionServicePage";
import ServicesIntroSectionServicePage from "@/components/ServicesIntroSectionServicePage";
import ServicesCatalogueSectionServicePage from "@/components/ServicesCatalogueSectionServicePage";
import ServicesExecutionSectionServicePage from "@/components/ServicesExecutionSectionServicePage";
import { DEFAULT_HERO_SECTION_SERVICE_PAGE } from "@/lib/hero-section-service-page";
import { DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE } from "@/lib/services-intro-section-service-page";
import { DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE } from "@/lib/services-catalogue-section-service-page";
import { DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE } from "@/lib/services-execution-section-service-page";
import HeroSectionTools from "@/components/HeroSectionTools";
import ToolsIntroSectionTools from "@/components/ToolsIntroSectionTools";
import ToolsFlagshipSectionTools from "@/components/ToolsFlagshipSectionTools";
import ToolsCtaSectionTools from "@/components/ToolsCtaSectionTools";
import { DEFAULT_HERO_SECTION_TOOLS } from "@/lib/hero-section-tools";
import { DEFAULT_TOOLS_INTRO_SECTION_TOOLS } from "@/lib/tools-intro-section-tools";
import { DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS } from "@/lib/tools-flagship-section-tools";
import { DEFAULT_TOOLS_CTA_SECTION_TOOLS } from "@/lib/tools-cta-section-tools";
import HeroSectionSoftware from "@/components/HeroSectionSoftware";
import SoftwareIntroSectionSoftware from "@/components/SoftwareIntroSectionSoftware";
import SoftwareModulesSectionSoftware from "@/components/SoftwareModulesSectionSoftware";
import SoftwareCtaSectionSoftware from "@/components/SoftwareCtaSectionSoftware";
import { DEFAULT_HERO_SECTION_SOFTWARE } from "@/lib/hero-section-software";
import { DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE } from "@/lib/software-intro-section-software";
import { DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE } from "@/lib/software-modules-section-software";
import { DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE } from "@/lib/software-cta-section-software";

type ComponentPreviewPageProps = {
  params: Promise<{ slug: string }>;
};

function renderPreview(slug: string) {
  if (slug === "page-hero") {
    return <PageHeroSection data={DEFAULT_PAGE_HERO_SECTION} />;
  }

  if (slug === "page-hero-simple") {
    return <PageHeroSimpleSection data={DEFAULT_PAGE_HERO_SIMPLE_SECTION} />;
  }

  if (slug === "hero-section-service-page") {
    return <HeroSectionServicePage data={DEFAULT_HERO_SECTION_SERVICE_PAGE} />;
  }

  if (slug === "services-intro-section-service-page") {
    return <ServicesIntroSectionServicePage data={DEFAULT_SERVICES_INTRO_SECTION_SERVICE_PAGE} />;
  }

  if (slug === "services-catalogue-section-service-page") {
    return (
      <ServicesCatalogueSectionServicePage data={DEFAULT_SERVICES_CATALOGUE_SECTION_SERVICE_PAGE} />
    );
  }

  if (slug === "services-execution-section-service-page") {
    return (
      <ServicesExecutionSectionServicePage data={DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE} />
    );
  }

  if (slug === "hero-section-tools") {
    return <HeroSectionTools data={DEFAULT_HERO_SECTION_TOOLS} />;
  }

  if (slug === "tools-intro-section-tools") {
    return <ToolsIntroSectionTools data={DEFAULT_TOOLS_INTRO_SECTION_TOOLS} />;
  }

  if (slug === "tools-flagship-section-tools") {
    return <ToolsFlagshipSectionTools data={DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS} />;
  }

  if (slug === "tools-cta-section-tools") {
    return <ToolsCtaSectionTools data={DEFAULT_TOOLS_CTA_SECTION_TOOLS} />;
  }

  if (slug === "hero-section-software") {
    return <HeroSectionSoftware data={DEFAULT_HERO_SECTION_SOFTWARE} />;
  }

  if (slug === "software-intro-section-software") {
    return <SoftwareIntroSectionSoftware data={DEFAULT_SOFTWARE_INTRO_SECTION_SOFTWARE} />;
  }

  if (slug === "software-modules-section-software") {
    return <SoftwareModulesSectionSoftware data={DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE} />;
  }

  if (slug === "software-cta-section-software") {
    return <SoftwareCtaSectionSoftware data={DEFAULT_SOFTWARE_CTA_SECTION_SOFTWARE} />;
  }

  if (slug === "page-clients") {
    return <PageClientsSection data={DEFAULT_PAGE_CLIENTS_SECTION} />;
  }

  if (slug === "asset-management-solution") {
    return <AssetManagementSolutionSection data={DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION} />;
  }

  if (slug === "page-faq") {
    return <PageFaqSection data={DEFAULT_PAGE_FAQ_SECTION} />;
  }

  if (slug === "page-cta") {
    return <PageCtaSection data={DEFAULT_PAGE_CTA_SECTION} />;
  }

  if (slug === "cta-reusable") {
    return <CtaReusableSection data={DEFAULT_CTA_REUSABLE_SECTION} />;
  }

  if (slug === "rich-text") {
    return (
      <RichTextSection
        data={{
          heading: "Sample page content",
          content:
            "This is a reusable rich text block. Add it below the hero on any dynamic page and edit the content separately for Service 1, Service 2, and other pages.",
        }}
      />
    );
  }

  if (slug === "resource-benefits") {
    return <ResourceBenefitsSection data={DEFAULT_RESOURCE_BENEFITS_SECTION} />;
  }

  if (slug === "resource-how-it-works") {
    return <ResourceHowItWorksSection data={DEFAULT_RESOURCE_HOW_IT_WORKS_SECTION} />;
  }

  if (slug === "resource-tool-workspace") {
    return <ResourceToolWorkspaceSection data={DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION} />;
  }

  if (slug === "feature-capabilities") {
    return <FeatureCapabilitiesSection data={DEFAULT_FEATURE_CAPABILITIES_SECTION} />;
  }

  if (slug === "feature-workflow") {
    return <FeatureWorkflowSection data={DEFAULT_FEATURE_WORKFLOW_SECTION} />;
  }

  if (slug === "feature-overview") {
    return <FeatureOverviewSection data={DEFAULT_FEATURE_OVERVIEW_SECTION} />;
  }

  if (slug === "feature-use-cases") {
    return <FeatureUseCasesSection data={DEFAULT_FEATURE_USE_CASES_SECTION} />;
  }

  if (slug === "feature-outcomes") {
    return <FeatureOutcomesSection data={DEFAULT_FEATURE_OUTCOMES_SECTION} />;
  }

  if (slug === "case-study") {
    return <CaseStudySection data={DEFAULT_CASE_STUDY_SECTION} />;
  }

  return null;
}

export default async function ComponentPreviewPage({ params }: ComponentPreviewPageProps) {
  const { slug } = await params;
  const preview = renderPreview(slug);

  if (!preview) {
    notFound();
  }

  return <div className="min-h-screen bg-white">{preview}</div>;
}
