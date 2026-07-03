import { defaultTrackSectionData } from "./track-defaults.js";
import { defaultTechnologyPlatformSectionData } from "./technology-platform-defaults.js";
import { defaultTrustedIndustriesSectionData } from "./trusted-industries-defaults.js";
import { defaultFootprintsSectionData } from "./footprints-defaults.js";
import { defaultTestimonialsSectionData } from "./testimonials-defaults.js";
import { defaultMoreClientsSectionData } from "./more-clients-defaults.js";
import { defaultAboutPageHeroSectionData } from "./about-page-hero-defaults.js";
import { defaultWhoWeAreAboutSectionData } from "./who-we-are-about-defaults.js";
import { defaultOurJourneyAboutSectionData } from "./our-journey-about-defaults.js";
import { defaultWhatWeDeliverAboutSectionData } from "./what-we-deliver-about-defaults.js";
import { defaultReachTrustAboutSectionData } from "./reach-trust-about-defaults.js";
import { defaultResourcePageHeroSectionData } from "./resource-page-hero-defaults.js";
import { defaultPageHeroSectionData } from "./page-hero-defaults.js";
import { defaultPageClientsSectionData } from "./page-clients-defaults.js";
import { defaultAssetManagementSolutionSectionData } from "./asset-management-solution-defaults.js";
import { defaultPageFaqSectionData } from "./page-faq-defaults.js";
import { defaultPageCtaSectionData } from "./page-cta-defaults.js";
import { defaultCtaReusableSectionData } from "./cta-reusable-defaults.js";
import { defaultHeroSectionServicePageData } from "./hero-section-service-page-defaults.js";
import { defaultServicesIntroSectionServicePageData } from "./services-intro-section-service-page-defaults.js";
import { defaultServicesCatalogueSectionServicePageData } from "./services-catalogue-section-service-page-defaults.js";
import { defaultServicesExecutionSectionServicePageData } from "./services-execution-section-service-page-defaults.js";
import { defaultHeroSectionToolsData } from "./hero-section-tools-defaults.js";
import { defaultToolsIntroSectionToolsData } from "./tools-intro-section-tools-defaults.js";
import { defaultToolsFlagshipSectionToolsData } from "./tools-flagship-section-tools-defaults.js";
import { defaultToolsCtaSectionToolsData } from "./tools-cta-section-tools-defaults.js";
import { defaultHeroSectionSoftwareData } from "./hero-section-software-defaults.js";
import { defaultSoftwareIntroSectionSoftwareData } from "./software-intro-section-software-defaults.js";
import { defaultSoftwareModulesSectionSoftwareData } from "./software-modules-section-software-defaults.js";
import { defaultSoftwareCtaSectionSoftwareData } from "./software-cta-section-software-defaults.js";

export const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "clients", label: "Clients" },
  { value: "about", label: "About Us" },
  { value: "track", label: "Track" },
  { value: "technology_platform", label: "Technology Platform" },
  { value: "trusted_industries", label: "Trusted across industries" },
  { value: "footprints", label: "Footprints Software" },
  { value: "services", label: "Services" },
  { value: "stats", label: "Stats" },
  { value: "team", label: "Team" },
  { value: "gallery", label: "Gallery" },
  { value: "faq", label: "FAQ" },
  { value: "testimonials", label: "Testimonials" },
  { value: "more_clients", label: "More clients" },
  { value: "about_page_hero", label: "About Hero" },
  { value: "who_we_are_about", label: "Who we are - About" },
  { value: "our_journey_about", label: "Our Journey - About" },
  { value: "what_we_deliver_about", label: "What We Deliver - About" },
  { value: "reach_trust_about", label: "Reach & Trust - About" },
  { value: "page_hero", label: "Reusable Page Hero" },
  { value: "page_clients", label: "Reusable Client Logos" },
  { value: "asset_management_solution", label: "Reusable Asset Management Software Solution" },
  { value: "page_faq", label: "Reusable FAQ" },
  { value: "page_cta", label: "Reusable CTA" },
  { value: "cta_reusable", label: "CTA - Reusable" },
  { value: "resource_page_hero", label: "Resource Page Hero" },
  { value: "hero_section_service_page", label: "Hero Section - Service Page" },
  { value: "services_intro_section_service_page", label: "Services Intro - Service Page" },
  { value: "services_catalogue_section_service_page", label: "Services Catalogue - Service Page" },
  { value: "services_execution_section_service_page", label: "Services Execution - Service Page" },
  { value: "hero_section_tools", label: "Hero Section - Tools" },
  { value: "tools_intro_section_tools", label: "Tools Intro - Tools" },
  { value: "tools_flagship_section_tools", label: "Tools Flagship - Tools" },
  { value: "tools_cta_section_tools", label: "Tools CTA - Tools" },
  { value: "hero_section_software", label: "Hero Section - Software" },
  { value: "software_intro_section_software", label: "Software Intro - Software" },
  { value: "software_modules_section_software", label: "Software Modules - Software" },
  { value: "software_cta_section_software", label: "Software CTA - Software" },
  { value: "cta", label: "Call to Action" },
  { value: "timeline", label: "Timeline" },
  { value: "contact_form", label: "Contact Form" },
  { value: "pricing", label: "Pricing" },
  { value: "article_body", label: "Article Body" },
  { value: "rich_text", label: "Rich Text" },
  { value: "video", label: "Video" },
  { value: "partners", label: "Partners" },
];

export function defaultSectionData(type) {
  const defaults = {
    hero: {
      background_type: "video",
      image_id: null,
      video_url: "https://www.tagrobotech.com/videos/hero.mp4",
      video_id: null,
      tagline: "RFID • IoT • Asset Tracking • Automation",
      badge: "Industry pioneer",
      heading: "Transform Assets Into",
      heading_accent: "Real-Time Intelligence",
      description:
        "The first to bring integrated tag, robotics & technology tracking to enterprises. We help enterprises automate inventory, asset tracking, and operations using RFID, BLE, IoT, and AI-powered technologies.",
      primary_button: { text: "Get free consultation", link: "/contact" },
      secondary_button: { text: "Explore solutions", link: "#services" },
      stats: [
        { value: "500+", label: "Projects Delivered" },
        { value: "99%", label: "Tracking Accuracy" },
        { value: "Worldwide", label: "Support & Service" },
      ],
    },
    clients: {
      heading: "Trusted by leading enterprises — industry pioneers since day one",
      subtext: "and more...",
      items: [],
    },
    about: {
      tagline: "About Us",
      heading: "Pioneers of",
      heading_accent: "Asset Tracking",
      paragraphs: [
        "Tag RoBo Tech pioneered enterprise asset tracking in India — among the first in the industry to unify RFID, IoT, BLE, and robotics into scalable tracking solutions.",
        "Tag RoBo Tech designs solutions by leveraging the core strengths of different types of tags, robotics, and technology.",
        "Over last 10 years, we have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc.. almost everything that needs to be tracked!",
        "Our technology platform applies innovative science to not only track but also collect/ transform data which can be used for operational intelligence...",
      ],
      visual_type: "spline",
      spline_scene_url: "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
      image_id: null,
    },
    track: defaultTrackSectionData(),
    technology_platform: defaultTechnologyPlatformSectionData(),
    trusted_industries: defaultTrustedIndustriesSectionData(),
    footprints: defaultFootprintsSectionData(),
    faq: { heading: "FAQ", items: [{ question: "", answer: "" }] },
    cta: { heading: "", button_text: "", button_link: "" },
    rich_text: { heading: "", content: "" },
    services: { items: [{ title: "", description: "" }] },
    stats: { items: [{ label: "", value: "" }] },
    gallery: { heading: "", items: [] },
    team: { heading: "", members: [{ name: "", role: "", image_id: null }] },
    testimonials: defaultTestimonialsSectionData(),
    more_clients: defaultMoreClientsSectionData(),
    about_page_hero: defaultAboutPageHeroSectionData(),
    who_we_are_about: defaultWhoWeAreAboutSectionData(),
    our_journey_about: defaultOurJourneyAboutSectionData(),
    what_we_deliver_about: defaultWhatWeDeliverAboutSectionData(),
    reach_trust_about: defaultReachTrustAboutSectionData(),
    page_hero: defaultPageHeroSectionData(),
    page_clients: defaultPageClientsSectionData(),
    asset_management_solution: defaultAssetManagementSolutionSectionData(),
    page_faq: defaultPageFaqSectionData(),
    page_cta: defaultPageCtaSectionData(),
    cta_reusable: defaultCtaReusableSectionData(),
    resource_page_hero: defaultResourcePageHeroSectionData(),
    hero_section_service_page: defaultHeroSectionServicePageData(),
    services_intro_section_service_page: defaultServicesIntroSectionServicePageData(),
    services_catalogue_section_service_page: defaultServicesCatalogueSectionServicePageData(),
    services_execution_section_service_page: defaultServicesExecutionSectionServicePageData(),
    hero_section_tools: defaultHeroSectionToolsData(),
    tools_intro_section_tools: defaultToolsIntroSectionToolsData(),
    tools_flagship_section_tools: defaultToolsFlagshipSectionToolsData(),
    tools_cta_section_tools: defaultToolsCtaSectionToolsData(),
    hero_section_software: defaultHeroSectionSoftwareData(),
    software_intro_section_software: defaultSoftwareIntroSectionSoftwareData(),
    software_modules_section_software: defaultSoftwareModulesSectionSoftwareData(),
    software_cta_section_software: defaultSoftwareCtaSectionSoftwareData(),
    timeline: { heading: "", items: [{ year: "", title: "", description: "" }] },
    contact_form: { heading: "Contact Us", submit_label: "Send" },
    pricing: { heading: "", items: [{ name: "", price: "", features: [] }] },
    article_body: { heading: "", content: "" },
    video: { heading: "", video_url: "", poster_id: null },
    partners: { heading: "", items: [] },
  };

  return defaults[type] ?? {};
}
