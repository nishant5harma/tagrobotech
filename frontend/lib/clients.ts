export type ClientLogo = {
  id: string;
  src: string;
  alt: string;
  featured?: boolean;
};

const CLIENTS_BASE = "/assets-images/clinets";

const NAMED_CLIENTS = [
  { file: "candor__logo.png", alt: "Candor" },
  { file: "ndtv__logo.png", alt: "NDTV" },
  { file: "tata__capital__logo.png", alt: "Tata Capital" },
] as const;

const CLIENT_LOGO_NUMBERS = [
  1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 24, 26, 27, 28,
  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
  47, 48, 49, 50, 51,
] as const;

export const CLIENT_LOGOS: ClientLogo[] = [
  ...NAMED_CLIENTS.map(({ file, alt }) => ({
    id: file.replace(/\.png$/, ""),
    src: `${CLIENTS_BASE}/${file}`,
    alt,
    featured: true,
  })),
  ...CLIENT_LOGO_NUMBERS.map((n) => ({
    id: `client-logo${n}`,
    src: `${CLIENTS_BASE}/client-logo${n}.png`,
    alt: `Enterprise client ${n}`,
  })),
];

export const FEATURED_CLIENT_LOGOS = CLIENT_LOGOS.filter((logo) => logo.featured);

export const HOME_CLIENT_LOGOS = CLIENT_LOGOS.slice(0, 20);

export const CLIENTS_HERO_BG = "/assets-images/drone-hero.jpeg";

export const CLIENT_STATS = [
  { value: "46+", label: "Enterprise partners" },
  { value: "13+", label: "Years of trust" },
  { value: "12+", label: "Industry verticals" },
  { value: "Pan-India", label: "Implementation reach" },
] as const;

export const CLIENT_INDUSTRIES = [
  "Banking & Finance",
  "Healthcare",
  "Retail & E-commerce",
  "Media & Broadcasting",
  "Manufacturing",
  "Real Estate",
  "Logistics & Fleet",
  "Government & PSU",
] as const;
