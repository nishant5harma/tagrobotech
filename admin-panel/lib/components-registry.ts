export type ReusableComponent = {
  slug: string;
  sectionType: string;
  label: string;
  description: string;
  usedOn: string[];
  previewPath: string;
};

export const REUSABLE_COMPONENTS: ReusableComponent[] = [
  {
    slug: "hero-section-software",
    sectionType: "hero_section_software",
    label: "Hero Section - Software",
    description: "Software landing page hero with headline, contact CTA, and phone number.",
    usedOn: ["page"],
    previewPath: "/preview/components/hero-section-software",
  },
  {
    slug: "software-intro-section-software",
    sectionType: "software_intro_section_software",
    label: "Software Intro - Software",
    description: "Footprints intro with badges, demo CTA, dashboard image, and three value props.",
    usedOn: ["page"],
    previewPath: "/preview/components/software-intro-section-software",
  },
  {
    slug: "software-modules-section-software",
    sectionType: "software_modules_section_software",
    label: "Software Modules - Software",
    description: "Nine Footprints modules with interactive preview and platform map grid.",
    usedOn: ["page"],
    previewPath: "/preview/components/software-modules-section-software",
  },
  {
    slug: "software-cta-section-software",
    sectionType: "software_cta_section_software",
    label: "Software CTA - Software",
    description: "Ready to deploy banner with demo and services CTAs.",
    usedOn: ["page"],
    previewPath: "/preview/components/software-cta-section-software",
  },
  {
    slug: "hero-section-tools",
    sectionType: "hero_section_tools",
    label: "Hero Section - Tools",
    description:
      "Tools landing page hero with headline, contact CTA, phone number, and dashboard mockup image.",
    usedOn: ["page"],
    previewPath: "/preview/components/hero-section-tools",
  },
  {
    slug: "tools-intro-section-tools",
    sectionType: "tools_intro_section_tools",
    label: "Tools Intro - Tools",
    description:
      "Tools that track section with stats, CTAs, and flagship tool preview pills.",
    usedOn: ["page"],
    previewPath: "/preview/components/tools-intro-section-tools",
  },
  {
    slug: "tools-flagship-section-tools",
    sectionType: "tools_flagship_section_tools",
    label: "Tools Flagship - Tools",
    description:
      "Five flagship deployment tools with detailed descriptions, highlights, and deploy CTAs.",
    usedOn: ["page"],
    previewPath: "/preview/components/tools-flagship-section-tools",
  },
  {
    slug: "tools-cta-section-tools",
    sectionType: "tools_cta_section_tools",
    label: "Tools CTA - Tools",
    description:
      "Need the right tool banner with services and consultation CTAs.",
    usedOn: ["page"],
    previewPath: "/preview/components/tools-cta-section-tools",
  },
  {
    slug: "hero-section-service-page",
    sectionType: "hero_section_service_page",
    label: "Hero Section - Service Page",
    description:
      "Services landing page hero with headline, contact CTA, phone number, and dashboard mockup image.",
    usedOn: ["service", "page"],
    previewPath: "/preview/components/hero-section-service-page",
  },
  {
    slug: "services-intro-section-service-page",
    sectionType: "services_intro_section_service_page",
    label: "Services Intro - Service Page",
    description:
      "What we help to track section with featured service cards and the Reconcile / Tag / Integrate / Monitor process steps.",
    usedOn: ["service", "page"],
    previewPath: "/preview/components/services-intro-section-service-page",
  },
  {
    slug: "services-catalogue-section-service-page",
    sectionType: "services_catalogue_section_service_page",
    label: "Services Catalogue - Service Page",
    description:
      "Full services catalogue with category filters, 20 service cards, and detailed per-service listings with enquire CTAs.",
    usedOn: ["service", "page"],
    previewPath: "/preview/components/services-catalogue-section-service-page",
  },
  {
    slug: "services-execution-section-service-page",
    sectionType: "services_execution_section_service_page",
    label: "Services Execution - Service Page",
    description:
      "End-to-end execution banner with About and consultation CTAs at the bottom of the services page.",
    usedOn: ["service", "page"],
    previewPath: "/preview/components/services-execution-section-service-page",
  },
  {
    slug: "page-hero",
    sectionType: "page_hero",
    label: "Reusable Page Hero",
    description:
      "Full-width hero with breadcrumbs, headline, CTAs, stat cards, and desktop/mobile mockups. Add this to any dynamic page and edit the content per page from the backend.",
    usedOn: ["solution", "feature", "resource", "service"],
    previewPath: "/preview/components/page-hero",
  },
  {
    slug: "page-clients",
    sectionType: "page_clients",
    label: "Reusable Client Logos",
    description:
      "Trusted-by client logo grid with highlighted heading. Use the same layout on multiple pages and choose different logos or headings per page.",
    usedOn: ["solution", "feature", "resource", "service"],
    previewPath: "/preview/components/page-clients",
  },
  {
    slug: "asset-management-solution",
    sectionType: "asset_management_solution",
    label: "Reusable Asset Management Software Solution",
    description:
      "Tabbed solution section with accordion features, CTA, and dashboard preview. Reuse on multiple pages with different tab content per page.",
    usedOn: ["solution", "feature", "resource", "service"],
    previewPath: "/preview/components/asset-management-solution",
  },
  {
    slug: "page-faq",
    sectionType: "page_faq",
    label: "Reusable FAQ",
    description:
      "Accordion FAQ section with editable heading and Q&A items. Add to any dynamic page and customize questions per page from the admin panel.",
    usedOn: ["solution", "feature", "resource", "service"],
    previewPath: "/preview/components/page-faq",
  },
  {
    slug: "page-cta",
    sectionType: "page_cta",
    label: "Reusable CTA",
    description:
      "Dark banner call-to-action with heading, description, and two buttons. Reuse on multiple pages with different copy and links per page.",
    usedOn: ["solution", "feature", "resource", "service", "home"],
    previewPath: "/preview/components/page-cta",
  },
  {
    slug: "cta-reusable",
    sectionType: "cta_reusable",
    label: "CTA - Reusable",
    description:
      "Orange pill consultation banner with headline, CTA button, and trust badges. Add to home or any dynamic page with per-page content.",
    usedOn: ["solution", "feature", "resource", "service", "home"],
    previewPath: "/preview/components/cta-reusable",
  },
  {
    slug: "rich-text",
    sectionType: "rich_text",
    label: "Rich Text",
    description:
      "Flexible text block for page body content. Pair it with the page hero on dynamic pages.",
    usedOn: ["solution", "feature", "resource", "service"],
    previewPath: "/preview/components/rich-text",
  },
];

export function getReusableComponent(slug: string) {
  return REUSABLE_COMPONENTS.find((component) => component.slug === slug) ?? null;
}

export function getFrontendPreviewUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "http://localhost:3000";

  return `${base.replace(/\/$/, "")}${path}`;
}
