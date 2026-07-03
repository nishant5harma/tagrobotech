import { CONTACT_INFO, OFFICES } from "@/lib/contact";

export const FOOTER_ABOUT =
  "We have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc. almost everything that needs to be tracked!";

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/services" },
  { label: "Services", href: "/services" },
  { label: "Clients", href: "/clients" },
  { label: "Blogs", href: "/#blogs" },
] as const;

export const FOOTER_SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/contact#faqs" },
  { label: "Customer Support", href: "/contact" },
  { label: "How it Works", href: "/services" },
  { label: "Terms & Conditions", href: "/contact#terms" },
] as const;

export const FOOTER_CONTACT = {
  headOffice: OFFICES[0].address,
  rndCentre: OFFICES[1].address,
  email: CONTACT_INFO.generalEmail,
  salesPhone: CONTACT_INFO.salesPhone,
  partnerPhone: CONTACT_INFO.partnerPhone,
} as const;

export const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/contact#privacy" },
  { label: "Terms of Use", href: "/contact#terms" },
] as const;
