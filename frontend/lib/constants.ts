export const HERO_VIDEO = "https://www.tagrobotech.com/videos/hero.mp4";

export const SPLINE_ROBOT_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const CONTACT_PHONE = "9319013339";

export const PIONEER_BADGE = "Industry pioneer";

export const PIONEER_HEADLINE =
  "The first to bring integrated tag, robotics & technology tracking to enterprises.";

export const PIONEER_STATEMENT =
  "Tag RoBo Tech pioneered enterprise asset tracking in India — among the first in the industry to unify RFID, IoT, BLE, and robotics into scalable tracking solutions.";

export const HERO_STATS = [
  { value: "500+", label: "Projects Delivered" },
  { value: "99%", label: "Tracking Accuracy" },
  { value: "Worldwide", label: "Support & Service" },
] as const;

export const TRUSTED_LOGOS = [
  { src: "/images/tata__capital__logo.png", alt: "Tata Capital" },
  { src: "/images/mahindra.png", alt: "Mahindra" },
  { src: "/images/candor__logo.png", alt: "Candor" },
  { src: "/images/ndtv__logo.png", alt: "NDTV" },
  { src: "/images/lava__logo.png", alt: "Lava" },
  { src: "/images/flipkart.png", alt: "Flipkart" },
  { src: "/images/saintgobian__logo.png", alt: "Saint-Gobain" },
  { src: "/images/client-logo1.png", alt: "Enterprise client" },
  { src: "/images/client-logo5.png", alt: "Enterprise client" },
  { src: "/images/client-logo8.png", alt: "Enterprise client" },
  { src: "/images/hcl.png", alt: "HCL" },
  { src: "/images/max.png", alt: "Max Healthcare" },
  { src: "/images/pvr.png", alt: "PVR" },
  { src: "/images/cocacola.png", alt: "Coca-Cola" },
  { src: "/images/brookfield.png", alt: "Brookfield" },
] as const;

export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/tagrobotechllp",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tagrobotechllp/",
  },
  {
    label: "X",
    href: "https://x.com/tagrobotechllp",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tag-robo-tech-official-llp/",
  },
] as const;

export const NAV_LINKS_BEFORE_MEGA = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
] as const;

export const NAV_LINKS_AFTER_MEGA = [
  { label: "Services", href: "/services" },
  { label: "Tools", href: "/tools" },
  { label: "Software", href: "/software" },
] as const;

/** @deprecated Use NAV_LINKS_BEFORE_MEGA + NAV_LINKS_AFTER_MEGA */
export const NAV_LINKS = [
  ...NAV_LINKS_BEFORE_MEGA,
  ...NAV_LINKS_AFTER_MEGA,
] as const;

export const MEGA_MENU_ORDER = ["solutions", "resources", "features"] as const;
