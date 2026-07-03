import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Boxes,
  Car,
  Cog,
  CupSoda,
  Factory,
  Flame,
  GraduationCap,
  HardHat,
  HeartPulse,
  MapPin,
  Megaphone,
  Monitor,
  Network,
  Package,
  Pickaxe,
  Pill,
  Radio,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { INDUSTRIES, INDUSTRY_STATS, type IndustryIcon } from "@/lib/industries";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type StatIconKey = "building" | "map_pin" | "users" | "package";

export type TrustedIndustryStat = {
  value: string;
  label: string;
  icon: StatIconKey;
};

export type TrustedIndustryItem = {
  name: string;
  projects: string;
  icon: IndustryIcon;
  accent: string;
  image_alt: string;
  image_src: string;
  media_id: string | null;
  image_url?: string | null;
};

export type TrustedIndustriesSectionData = {
  heading: string;
  heading_accent: string;
  description: string;
  tags: string[];
  featured_label: string;
  background_image_src: string;
  background_media_id: string | null;
  background_image_url?: string | null;
  stats: TrustedIndustryStat[];
  items: TrustedIndustryItem[];
};

const STAT_ICON_COMPONENTS: Record<StatIconKey, LucideIcon> = {
  building: Building2,
  map_pin: MapPin,
  users: Users,
  package: Package,
};

const INDUSTRY_ICON_COMPONENTS: Record<IndustryIcon, LucideIcon> = {
  car: Car,
  cup: CupSoda,
  monitor: Monitor,
  factory: Factory,
  pill: Pill,
  shopping: ShoppingBag,
  package: Package,
  sprout: Sprout,
  hardhat: HardHat,
  pickaxe: Pickaxe,
  cog: Cog,
  radio: Radio,
  megaphone: Megaphone,
  building: Building2,
  trending: TrendingUp,
  truck: Truck,
  health: HeartPulse,
  network: Network,
  flame: Flame,
  education: GraduationCap,
  boxes: Boxes,
};

const DEFAULT_ITEMS: TrustedIndustryItem[] = INDUSTRIES.map((industry) => ({
  name: industry.name,
  projects: industry.projects,
  icon: industry.icon,
  accent: industry.accent,
  image_alt: industry.imageAlt,
  image_src: industry.imageSrc,
  media_id: null,
}));

export const DEFAULT_TRUSTED_INDUSTRIES_SECTION: TrustedIndustriesSectionData = {
  heading: "Trusted across",
  heading_accent: "industries",
  description:
    "As pioneers in enterprise tracking, we have spent over 10 years servicing clients across industries — helping them gain the upper hand in asset visibility across diverse sectors.",
  tags: ["21 sectors", "GPS · RFID · BLE", "Pan-India delivery"],
  featured_label: "Featured sectors",
  background_image_src: "/images/homepage-banner.jpg",
  background_media_id: null,
  stats: [
    { value: INDUSTRY_STATS[0].value, label: INDUSTRY_STATS[0].label, icon: "building" },
    { value: INDUSTRY_STATS[1].value, label: INDUSTRY_STATS[1].label, icon: "map_pin" },
    { value: INDUSTRY_STATS[2].value, label: INDUSTRY_STATS[2].label, icon: "users" },
    { value: INDUSTRY_STATS[3].value, label: INDUSTRY_STATS[3].label, icon: "package" },
  ],
  items: DEFAULT_ITEMS,
};

function asRecord(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) ?? {};
}

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_TRUSTED_INDUSTRIES_SECTION.tags];
  const tags = value.map((tag) => String(tag ?? "").trim()).filter(Boolean);
  return tags.length ? tags : [...DEFAULT_TRUSTED_INDUSTRIES_SECTION.tags];
}

function asStatIcon(value: unknown, fallback: StatIconKey): StatIconKey {
  const icon = String(value ?? fallback);
  return STAT_ICON_COMPONENTS[icon as StatIconKey] ? (icon as StatIconKey) : fallback;
}

function asIndustryIcon(value: unknown, fallback: IndustryIcon): IndustryIcon {
  const icon = String(value ?? fallback);
  return INDUSTRY_ICON_COMPONENTS[icon as IndustryIcon] ? (icon as IndustryIcon) : fallback;
}

function asStats(value: unknown): TrustedIndustryStat[] {
  if (!Array.isArray(value)) return [...DEFAULT_TRUSTED_INDUSTRIES_SECTION.stats];
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TRUSTED_INDUSTRIES_SECTION.stats[index] ?? {
      value: "",
      label: "",
      icon: "building" as StatIconKey,
    };
    return {
      value: String(row.value ?? fallback.value),
      label: String(row.label ?? fallback.label),
      icon: asStatIcon(row.icon, fallback.icon),
    };
  });
}

function asItems(value: unknown): TrustedIndustryItem[] {
  if (!Array.isArray(value) || value.length === 0) return [...DEFAULT_ITEMS];

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_ITEMS[index] ?? {
      name: "",
      projects: "",
      icon: "building" as IndustryIcon,
      accent: "from-blue-600/80 to-blue-900/40",
      image_alt: "",
      image_src: "",
      media_id: null,
    };

    return {
      name: String(row.name ?? fallback.name),
      projects: String(row.projects ?? fallback.projects),
      icon: asIndustryIcon(row.icon, fallback.icon),
      accent: String(row.accent ?? fallback.accent),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_src: String(row.image_src ?? fallback.image_src),
      media_id: row.media_id ? String(row.media_id) : null,
      image_url: row.image_url ? String(row.image_url) : null,
    };
  });
}

export function normalizeTrustedIndustriesSectionData(
  raw: unknown
): TrustedIndustriesSectionData {
  const data = asRecord(raw);

  return {
    heading: String(data.heading ?? DEFAULT_TRUSTED_INDUSTRIES_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_TRUSTED_INDUSTRIES_SECTION.heading_accent
    ),
    description: String(data.description ?? DEFAULT_TRUSTED_INDUSTRIES_SECTION.description),
    tags: asTags(data.tags),
    featured_label: String(
      data.featured_label ?? DEFAULT_TRUSTED_INDUSTRIES_SECTION.featured_label
    ),
    background_image_src: String(
      data.background_image_src ?? DEFAULT_TRUSTED_INDUSTRIES_SECTION.background_image_src
    ),
    background_media_id: data.background_media_id ? String(data.background_media_id) : null,
    background_image_url: data.background_image_url ? String(data.background_image_url) : null,
    stats: asStats(data.stats),
    items: asItems(data.items),
  };
}

export function mergeTrustedIndustriesSectionData(
  cmsData: TrustedIndustriesSectionData | null
): TrustedIndustriesSectionData {
  if (!cmsData) return DEFAULT_TRUSTED_INDUSTRIES_SECTION;
  return normalizeTrustedIndustriesSectionData(cmsData);
}

export function trustedIndustriesBackgroundSrc(section: TrustedIndustriesSectionData): string {
  if (section.background_image_url) return resolveCmsMediaUrl(section.background_image_url);
  return section.background_image_src;
}

export type ResolvedTrustedIndustry = {
  name: string;
  projects: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
};

export function toTrustedIndustryCards(
  section: TrustedIndustriesSectionData
): ResolvedTrustedIndustry[] {
  return section.items.map((item) => ({
    name: item.name,
    projects: item.projects,
    imageSrc: item.image_url ? resolveCmsMediaUrl(item.image_url) : item.image_src,
    imageAlt: item.image_alt || item.name,
    accent: item.accent,
  }));
}

export function resolveStatIcon(icon: StatIconKey): LucideIcon {
  return STAT_ICON_COMPONENTS[icon];
}

export { INDUSTRY_ICON_COMPONENTS };
