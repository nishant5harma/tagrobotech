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
  { value: "resource_page_hero", label: "Resource Page Hero" },
  { value: "cta", label: "Call to Action" },
  { value: "timeline", label: "Timeline" },
  { value: "contact_form", label: "Contact Form" },
  { value: "pricing", label: "Pricing" },
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
    resource_page_hero: defaultResourcePageHeroSectionData(),
    timeline: { heading: "", items: [{ year: "", title: "", description: "" }] },
    contact_form: { heading: "Contact Us", submit_label: "Send" },
    pricing: { heading: "", items: [{ name: "", price: "", features: [] }] },
    video: { heading: "", video_url: "", poster_id: null },
    partners: { heading: "", items: [] },
  };

  return defaults[type] ?? {};
}
