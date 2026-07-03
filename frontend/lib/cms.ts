import { normalizeHeroData, type HeroSectionData } from "@/lib/hero";
import { normalizeClientsSectionData, type ClientsSectionData } from "@/lib/clients-section";
import { normalizeAboutSectionData, type AboutSectionData } from "@/lib/about-section";
import { normalizeTrackSectionData, type TrackSectionData } from "@/lib/track-section";
import {
  normalizeTechnologyPlatformSectionData,
  type TechnologyPlatformSectionData,
} from "@/lib/technology-platform";
import {
  normalizeTrustedIndustriesSectionData,
  type TrustedIndustriesSectionData,
} from "@/lib/trusted-industries";
import {
  normalizeFootprintsSectionData,
  type FootprintsSectionData,
} from "@/lib/footprints-section";
import {
  normalizeTestimonialsSectionData,
  type TestimonialsSectionData,
} from "@/lib/testimonials-section";
import {
  normalizeMoreClientsSectionData,
  type MoreClientsSectionData,
} from "@/lib/more-clients-section";
import {
  normalizeAboutPageHeroSectionData,
  type AboutPageHeroSectionData,
} from "@/lib/about-page-hero-section";
import {
  normalizeWhoWeAreAboutSectionData,
  type WhoWeAreAboutSectionData,
} from "@/lib/who-we-are-about-section";
import {
  normalizeOurJourneyAboutSectionData,
  type OurJourneyAboutSectionData,
} from "@/lib/our-journey-about-section";
import {
  normalizeWhatWeDeliverAboutSectionData,
  type WhatWeDeliverAboutSectionData,
} from "@/lib/what-we-deliver-about-section";
import {
  normalizeReachTrustAboutSectionData,
  type ReachTrustAboutSectionData,
} from "@/lib/reach-trust-about-section";
import {
  normalizeHeroSectionServicePageData,
  type HeroSectionServicePageData,
} from "@/lib/hero-section-service-page";
import {
  normalizeServicesIntroSectionServicePageData,
  type ServicesIntroSectionServicePageData,
} from "@/lib/services-intro-section-service-page";
import {
  normalizeServicesCatalogueSectionServicePageData,
  type ServicesCatalogueSectionServicePageData,
} from "@/lib/services-catalogue-section-service-page";
import {
  normalizeServicesExecutionSectionServicePageData,
  type ServicesExecutionSectionServicePageData,
} from "@/lib/services-execution-section-service-page";
import {
  normalizeHeroSectionToolsData,
  type HeroSectionToolsData,
} from "@/lib/hero-section-tools";
import {
  normalizeToolsIntroSectionToolsData,
  type ToolsIntroSectionToolsData,
} from "@/lib/tools-intro-section-tools";
import {
  normalizeToolsFlagshipSectionToolsData,
  type ToolsFlagshipSectionToolsData,
} from "@/lib/tools-flagship-section-tools";
import {
  normalizeToolsCtaSectionToolsData,
  type ToolsCtaSectionToolsData,
} from "@/lib/tools-cta-section-tools";
import {
  normalizeHeroSectionSoftwareData,
  type HeroSectionSoftwareData,
} from "@/lib/hero-section-software";
import {
  normalizeSoftwareIntroSectionSoftwareData,
  type SoftwareIntroSectionSoftwareData,
} from "@/lib/software-intro-section-software";
import {
  normalizeSoftwareModulesSectionSoftwareData,
  type SoftwareModulesSectionSoftwareData,
} from "@/lib/software-modules-section-software";
import {
  normalizeSoftwareCtaSectionSoftwareData,
  type SoftwareCtaSectionSoftwareData,
} from "@/lib/software-cta-section-software";
import {
  normalizeMegaMenuData,
  type MegaMenuData,
  type MegaMenuKind,
  type ResourcesMegaMenuData,
} from "@/lib/mega-menu";

const CMS_API_URL =
  process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:4000";

export type CmsPageSection = {
  id: string;
  section_type: string;
  position: number;
  is_active: boolean | number;
  data: Record<string, unknown>;
  updated_at?: string;
};

export type CmsPageResponse = {
  page: {
    id: string;
    title: string;
    slug: string;
    page_type: string;
    status: string;
    excerpt?: string | null;
    featured_image_id?: string | null;
    featured_image_url?: string | null;
    featured_image_alt?: string | null;
    published_at?: string | null;
    author_name?: string | null;
    client_name?: string | null;
    industry?: string | null;
  };
  sections: CmsPageSection[];
  seo: Record<string, unknown> | null;
};

export type CmsContentListItem = {
  id: string;
  title: string;
  slug: string;
  page_type: string;
  status: string;
  excerpt: string | null;
  featured_image_id: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  author_name: string | null;
  client_name: string | null;
  industry: string | null;
  updated_at: string;
};

export function resolveCmsMediaUrl(fileUrl: string): string {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  const base = process.env.NEXT_PUBLIC_CMS_API_URL ?? "";
  return `${base}${fileUrl}`;
}

export async function getPublishedPage(slug: string): Promise<CmsPageResponse | null> {
  const slugParam = slug === "/" ? "home" : encodeURIComponent(slug);

  try {
    const response = await fetch(`${CMS_API_URL}/api/public/pages/${slugParam}`, {
      next: { revalidate: 60 },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error("CMS fetch failed:", response.status, await response.text());
      return null;
    }

    return (await response.json()) as CmsPageResponse;
  } catch (error) {
    console.error("CMS fetch error:", error);
    return null;
  }
}

export async function getPublishedContentList(
  pageType: "blog" | "case_study",
  options?: { limit?: number; offset?: number }
): Promise<CmsContentListItem[]> {
  const search = new URLSearchParams();
  if (options?.limit) search.set("limit", String(options.limit));
  if (options?.offset) search.set("offset", String(options.offset));

  try {
    const response = await fetch(
      `${CMS_API_URL}/api/public/content/${pageType}${search.size ? `?${search.toString()}` : ""}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error("CMS content list failed:", response.status);
      return [];
    }

    const payload = (await response.json()) as { items?: CmsContentListItem[] };
    return payload.items ?? [];
  } catch (error) {
    console.error("CMS content list error:", error);
    return [];
  }
}

export function getHeroSectionFromPage(page: CmsPageResponse | null): HeroSectionData | null {
  if (!page) return null;

  const heroSection = page.sections.find(
    (section) => section.section_type === "hero" && section.is_active
  );

  if (!heroSection?.data) return null;

  return normalizeHeroData(heroSection.data);
}

export function getClientsSectionFromPage(page: CmsPageResponse | null): ClientsSectionData | null {
  if (!page) return null;

  const clientsSection = page.sections.find(
    (section) => section.section_type === "clients" && section.is_active
  );

  if (!clientsSection?.data) return null;

  return normalizeClientsSectionData(clientsSection.data);
}

export function getAboutSectionFromPage(page: CmsPageResponse | null): AboutSectionData | null {
  if (!page) return null;

  const aboutSection = page.sections.find(
    (section) => section.section_type === "about" && section.is_active
  );

  if (!aboutSection?.data) return null;

  return normalizeAboutSectionData(aboutSection.data);
}

export function getTrackSectionFromPage(page: CmsPageResponse | null): TrackSectionData | null {
  if (!page) return null;

  const trackSection = page.sections.find(
    (section) => section.section_type === "track" && section.is_active
  );

  if (!trackSection?.data) return null;

  return normalizeTrackSectionData(trackSection.data);
}

export function getTechnologyPlatformSectionFromPage(
  page: CmsPageResponse | null
): TechnologyPlatformSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "technology_platform" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeTechnologyPlatformSectionData(section.data);
}

export function getTrustedIndustriesSectionFromPage(
  page: CmsPageResponse | null
): TrustedIndustriesSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "trusted_industries" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeTrustedIndustriesSectionData(section.data);
}

export function getFootprintsSectionFromPage(
  page: CmsPageResponse | null
): FootprintsSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "footprints" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeFootprintsSectionData(section.data);
}

export function getTestimonialsSectionFromPage(
  page: CmsPageResponse | null
): TestimonialsSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "testimonials" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeTestimonialsSectionData(section.data);
}

export function getMoreClientsSectionFromPage(
  page: CmsPageResponse | null
): MoreClientsSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "more_clients" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeMoreClientsSectionData(section.data);
}

export function getAboutPageHeroSectionFromPage(
  page: CmsPageResponse | null
): AboutPageHeroSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "about_page_hero" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeAboutPageHeroSectionData(section.data);
}

export function getWhoWeAreAboutSectionFromPage(
  page: CmsPageResponse | null
): WhoWeAreAboutSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "who_we_are_about" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeWhoWeAreAboutSectionData(section.data);
}

export function getOurJourneyAboutSectionFromPage(
  page: CmsPageResponse | null
): OurJourneyAboutSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "our_journey_about" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeOurJourneyAboutSectionData(section.data);
}

export function getWhatWeDeliverAboutSectionFromPage(
  page: CmsPageResponse | null
): WhatWeDeliverAboutSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "what_we_deliver_about" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeWhatWeDeliverAboutSectionData(section.data);
}

export function getReachTrustAboutSectionFromPage(
  page: CmsPageResponse | null
): ReachTrustAboutSectionData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "reach_trust_about" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeReachTrustAboutSectionData(section.data);
}

export function getHeroSectionServicePageFromPage(
  page: CmsPageResponse | null
): HeroSectionServicePageData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "hero_section_service_page" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeHeroSectionServicePageData(section.data);
}

export function getServicesIntroSectionServicePageFromPage(
  page: CmsPageResponse | null
): ServicesIntroSectionServicePageData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) =>
      section.section_type === "services_intro_section_service_page" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeServicesIntroSectionServicePageData(section.data);
}

export function getServicesCatalogueSectionServicePageFromPage(
  page: CmsPageResponse | null
): ServicesCatalogueSectionServicePageData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) =>
      section.section_type === "services_catalogue_section_service_page" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeServicesCatalogueSectionServicePageData(section.data);
}

export function getServicesExecutionSectionServicePageFromPage(
  page: CmsPageResponse | null
): ServicesExecutionSectionServicePageData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) =>
      section.section_type === "services_execution_section_service_page" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeServicesExecutionSectionServicePageData(section.data);
}

export function getHeroSectionToolsFromPage(
  page: CmsPageResponse | null
): HeroSectionToolsData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "hero_section_tools" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeHeroSectionToolsData(section.data);
}

export function getToolsIntroSectionToolsFromPage(
  page: CmsPageResponse | null
): ToolsIntroSectionToolsData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "tools_intro_section_tools" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeToolsIntroSectionToolsData(section.data);
}

export function getToolsFlagshipSectionToolsFromPage(
  page: CmsPageResponse | null
): ToolsFlagshipSectionToolsData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "tools_flagship_section_tools" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeToolsFlagshipSectionToolsData(section.data);
}

export function getToolsCtaSectionToolsFromPage(
  page: CmsPageResponse | null
): ToolsCtaSectionToolsData | null {
  if (!page) return null;

  const section = page.sections.find(
    (section) => section.section_type === "tools_cta_section_tools" && section.is_active
  );

  if (!section?.data) return null;

  return normalizeToolsCtaSectionToolsData(section.data);
}

export function getHeroSectionSoftwareFromPage(
  page: CmsPageResponse | null
): HeroSectionSoftwareData | null {
  if (!page) return null;
  const section = page.sections.find(
    (s) => s.section_type === "hero_section_software" && s.is_active
  );
  if (!section?.data) return null;
  return normalizeHeroSectionSoftwareData(section.data);
}

export function getSoftwareIntroSectionSoftwareFromPage(
  page: CmsPageResponse | null
): SoftwareIntroSectionSoftwareData | null {
  if (!page) return null;
  const section = page.sections.find(
    (s) => s.section_type === "software_intro_section_software" && s.is_active
  );
  if (!section?.data) return null;
  return normalizeSoftwareIntroSectionSoftwareData(section.data);
}

export function getSoftwareModulesSectionSoftwareFromPage(
  page: CmsPageResponse | null
): SoftwareModulesSectionSoftwareData | null {
  if (!page) return null;
  const section = page.sections.find(
    (s) => s.section_type === "software_modules_section_software" && s.is_active
  );
  if (!section?.data) return null;
  return normalizeSoftwareModulesSectionSoftwareData(section.data);
}

export function getSoftwareCtaSectionSoftwareFromPage(
  page: CmsPageResponse | null
): SoftwareCtaSectionSoftwareData | null {
  if (!page) return null;
  const section = page.sections.find(
    (s) => s.section_type === "software_cta_section_software" && s.is_active
  );
  if (!section?.data) return null;
  return normalizeSoftwareCtaSectionSoftwareData(section.data);
}

async function fetchMegaMenu(kind: MegaMenuKind): Promise<MegaMenuData | null> {
  try {
    const response = await fetch(`${CMS_API_URL}/api/public/navigation/${kind}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`${kind} menu fetch failed:`, response.status);
      return null;
    }

    const payload = (await response.json()) as { menu?: unknown };
    if (!payload.menu) return null;

    return normalizeMegaMenuData(payload.menu, kind);
  } catch (error) {
    console.error(`${kind} menu fetch error:`, error);
    return null;
  }
}

export async function getResourcesMegaMenu(): Promise<ResourcesMegaMenuData | null> {
  return fetchMegaMenu("resources");
}

export async function getFeaturesMegaMenu(): Promise<MegaMenuData | null> {
  return fetchMegaMenu("features");
}

export async function getSolutionsMegaMenu(): Promise<MegaMenuData | null> {
  return fetchMegaMenu("solutions");
}

export async function getAllMegaMenus(): Promise<{
  resources: MegaMenuData | null;
  features: MegaMenuData | null;
  solutions: MegaMenuData | null;
}> {
  const [resources, features, solutions] = await Promise.all([
    fetchMegaMenu("resources"),
    fetchMegaMenu("features"),
    fetchMegaMenu("solutions"),
  ]);

  return { resources, features, solutions };
}

export type ClientCarouselData = {
  heading: string;
  subtext: string;
  clients: Array<{
    id: string;
    name: string;
    logo_url: string;
    alt: string;
    website_url?: string | null;
  }>;
};

export function toClientCarouselData(section: ClientsSectionData | null): ClientCarouselData | null {
  if (!section || section.items.length === 0) return null;

  return {
    heading: section.heading,
    subtext: section.subtext,
    clients: section.items.map((item) => ({
      id: item.media_id,
      name: item.name,
      logo_url: resolveCmsMediaUrl(item.logo_url ?? ""),
      alt: item.alt || item.name,
      website_url: item.website_url || null,
    })),
  };
}

export function getHeroBackgroundUrl(hero: HeroSectionData): string | null {
  if (hero.background_type === "image") {
    const imageUrl = (hero as HeroSectionData & { image_url?: string }).image_url;
    if (imageUrl) return resolveCmsMediaUrl(imageUrl);
    return null;
  }

  if (hero.video_url) return resolveCmsMediaUrl(hero.video_url);
  return null;
}
