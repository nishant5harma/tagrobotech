"use client";

import HeroSectionTools from "@/components/HeroSectionTools";
import ToolsIntroSectionTools from "@/components/ToolsIntroSectionTools";
import ToolsFlagshipSectionTools from "@/components/ToolsFlagshipSectionTools";
import ToolsCtaSectionTools from "@/components/ToolsCtaSectionTools";
import CmsReusableSections from "@/components/CmsReusableSections";
import type { CmsPageResponse } from "@/lib/cms";
import type { HeroSectionToolsData } from "@/lib/hero-section-tools";
import type { ToolsIntroSectionToolsData } from "@/lib/tools-intro-section-tools";
import type { ToolsFlagshipSectionToolsData } from "@/lib/tools-flagship-section-tools";
import type { ToolsCtaSectionToolsData } from "@/lib/tools-cta-section-tools";

type ToolsPageExperienceProps = {
  page?: CmsPageResponse | null;
  heroData?: HeroSectionToolsData | null;
  introData?: ToolsIntroSectionToolsData | null;
  flagshipData?: ToolsFlagshipSectionToolsData | null;
  ctaData?: ToolsCtaSectionToolsData | null;
};

const TOOLS_SECTION_TYPES = new Set([
  "hero_section_tools",
  "tools_intro_section_tools",
  "tools_flagship_section_tools",
  "tools_cta_section_tools",
]);

export default function ToolsPageExperience({
  page,
  heroData,
  introData,
  flagshipData,
  ctaData,
}: ToolsPageExperienceProps) {
  const reusableSections = page?.sections.filter(
    (section) => !TOOLS_SECTION_TYPES.has(section.section_type)
  );

  return (
    <main className="overflow-hidden bg-white pt-[108px]">
      <HeroSectionTools data={heroData} />
      <ToolsIntroSectionTools data={introData} />
      <ToolsFlagshipSectionTools data={flagshipData} />
      <ToolsCtaSectionTools data={ctaData} />

      {reusableSections && reusableSections.length > 0 ? (
        <CmsReusableSections
          sections={reusableSections}
          pageContext={{
            pageType: page?.page.page_type ?? "page",
            pageTitle: page?.page.title ?? "Tools",
          }}
        />
      ) : null}
    </main>
  );
}
