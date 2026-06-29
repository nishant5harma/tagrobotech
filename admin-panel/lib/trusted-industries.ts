import trustedDefaults from "@/lib/data/trusted-industries.json";

export type IndustryIcon =
  | "car"
  | "cup"
  | "monitor"
  | "factory"
  | "pill"
  | "shopping"
  | "package"
  | "sprout"
  | "hardhat"
  | "pickaxe"
  | "cog"
  | "radio"
  | "megaphone"
  | "building"
  | "trending"
  | "truck"
  | "health"
  | "network"
  | "flame"
  | "education"
  | "boxes";

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
};

export type TrustedIndustriesSectionData = {
  heading: string;
  heading_accent: string;
  description: string;
  tags: string[];
  featured_label: string;
  background_image_src: string;
  background_media_id: string | null;
  stats: TrustedIndustryStat[];
  items: TrustedIndustryItem[];
};

export const STAT_ICON_OPTIONS: Array<{ value: StatIconKey; label: string }> = [
  { value: "building", label: "Building" },
  { value: "map_pin", label: "Map pin" },
  { value: "users", label: "Users" },
  { value: "package", label: "Package" },
];

export const INDUSTRY_ICON_OPTIONS: Array<{ value: IndustryIcon; label: string }> = [
  { value: "car", label: "Auto" },
  { value: "cup", label: "Beverages" },
  { value: "monitor", label: "IT" },
  { value: "factory", label: "Food processing" },
  { value: "pill", label: "Pharma" },
  { value: "shopping", label: "Retail" },
  { value: "package", label: "FMCG" },
  { value: "sprout", label: "Agriculture" },
  { value: "hardhat", label: "Construction" },
  { value: "pickaxe", label: "Mining" },
  { value: "cog", label: "Steel" },
  { value: "radio", label: "Telecom" },
  { value: "megaphone", label: "Advertising" },
  { value: "building", label: "Real estate" },
  { value: "trending", label: "Marketing" },
  { value: "truck", label: "Transport" },
  { value: "health", label: "Health" },
  { value: "network", label: "Distribution" },
  { value: "flame", label: "Coal / energy" },
  { value: "education", label: "Education" },
  { value: "boxes", label: "Commodity" },
];

export const DEFAULT_TRUSTED_INDUSTRIES_SECTION: TrustedIndustriesSectionData =
  trustedDefaults as TrustedIndustriesSectionData;

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
  return STAT_ICON_OPTIONS.some((option) => option.value === icon)
    ? (icon as StatIconKey)
    : fallback;
}

function asIndustryIcon(value: unknown, fallback: IndustryIcon): IndustryIcon {
  const icon = String(value ?? fallback);
  return INDUSTRY_ICON_OPTIONS.some((option) => option.value === icon)
    ? (icon as IndustryIcon)
    : fallback;
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
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_TRUSTED_INDUSTRIES_SECTION.items];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TRUSTED_INDUSTRIES_SECTION.items[index] ?? {
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
    stats: asStats(data.stats),
    items: asItems(data.items),
  };
}

export function trustedIndustriesSectionToPayload(
  data: TrustedIndustriesSectionData
): Record<string, unknown> {
  return { ...data };
}
