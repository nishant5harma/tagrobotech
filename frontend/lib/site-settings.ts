const CMS_API_URL =
  process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:4000";

export type FooterLinkItem = {
  label: string;
  href: string;
};

export type FooterContactSettings = {
  head_office: string;
  rnd_centre: string;
  email: string;
  sales_phone: string;
  partner_phone: string;
};

export type FooterSocialLink = {
  label: string;
  href: string;
};

export type FooterSettings = {
  logo_media_id: string | null;
  logo_url?: string | null;
  logo_alt?: string | null;
  about_text: string;
  quick_links: FooterLinkItem[];
  support_links: FooterLinkItem[];
  legal_links: FooterLinkItem[];
  social_links: FooterSocialLink[];
  contact: FooterContactSettings;
};

export type SiteBrandingSettings = {
  site_name: string;
  default_title: string;
  default_description: string;
  favicon_media_id: string | null;
  favicon_url?: string | null;
  favicon_alt?: string | null;
};

export const defaultSiteBrandingSettings: SiteBrandingSettings = {
  site_name: "Tag RoBo Tech",
  default_title: "Tag RoBo Tech | Pioneers of Enterprise Asset Tracking",
  default_description:
    "Tag RoBo Tech pioneered enterprise asset tracking in India — RFID, IoT, BLE, and robotics solutions for assets, inventory, fleet, and more.",
  favicon_media_id: null,
  favicon_url: null,
  favicon_alt: null,
};

export const defaultFooterSettings: FooterSettings = {
  logo_media_id: null,
  logo_url: null,
  logo_alt: "Tag RoBo Tech",
  about_text:
    "We have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc. almost everything that needs to be tracked!",
  quick_links: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/services" },
    { label: "Services", href: "/services" },
    { label: "Clients", href: "/clients" },
    { label: "Blogs", href: "/#blogs" },
  ],
  support_links: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/contact#faqs" },
    { label: "Customer Support", href: "/contact" },
    { label: "How it Works", href: "/services" },
    { label: "Terms & Conditions", href: "/contact#terms" },
  ],
  legal_links: [
    { label: "Privacy Policy", href: "/contact#privacy" },
    { label: "Terms of Use", href: "/contact#terms" },
  ],
  social_links: [
    { label: "Facebook", href: "https://www.facebook.com/tagrobotechllp" },
    { label: "Instagram", href: "https://www.instagram.com/tagrobotechllp/" },
    { label: "X", href: "https://x.com/tagrobotechllp" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tag-robo-tech-official-llp/" },
  ],
  contact: {
    head_office: "Suncity Success Tower, Sector-65, Gurugram — 122018",
    rnd_centre: "198, Udyog Vihar, Phase IV — Gurgaon — 122015",
    email: "info@tagrobotech.com",
    sales_phone: "9319013339",
    partner_phone: "9818883697",
  },
};

async function fetchPublicSettings<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${CMS_API_URL}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { settings?: T };
    return payload.settings ?? fallback;
  } catch (error) {
    console.error(`Public settings fetch failed for ${path}:`, error);
    return fallback;
  }
}

export async function getSiteBrandingSettings(): Promise<SiteBrandingSettings> {
  const settings = await fetchPublicSettings(
    "/api/public/settings/branding",
    defaultSiteBrandingSettings
  );
  return { ...defaultSiteBrandingSettings, ...settings };
}

export async function getFooterSettings(): Promise<FooterSettings> {
  const settings = await fetchPublicSettings("/api/public/settings/footer", defaultFooterSettings);
  return {
    ...defaultFooterSettings,
    ...settings,
    contact: {
      ...defaultFooterSettings.contact,
      ...(settings.contact ?? {}),
    },
  };
}
