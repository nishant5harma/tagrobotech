import technologyDefaults from "@/lib/data/technology-platform.json";

export type PlatformIconKey =
  | "gps"
  | "bluetooth"
  | "rfid"
  | "nfc"
  | "qr_code"
  | "barcode";

export type TechnologyPlatformItem = {
  name: string;
  description: string;
  icon: PlatformIconKey;
};

export type TechnologyPlatformSectionData = {
  tagline: string;
  heading: string;
  heading_accent: string;
  description: string;
  items: TechnologyPlatformItem[];
};

export const PLATFORM_ICON_OPTIONS: Array<{ value: PlatformIconKey; label: string }> = [
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "rfid", label: "RFID" },
  { value: "nfc", label: "NFC" },
  { value: "qr_code", label: "QR Code" },
  { value: "barcode", label: "Bar Code" },
];

export const DEFAULT_TECHNOLOGY_PLATFORM_SECTION: TechnologyPlatformSectionData =
  technologyDefaults as TechnologyPlatformSectionData;

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

function asIcon(value: unknown, fallback: PlatformIconKey): PlatformIconKey {
  const icon = String(value ?? fallback);
  return PLATFORM_ICON_OPTIONS.some((option) => option.value === icon)
    ? (icon as PlatformIconKey)
    : fallback;
}

function asItems(value: unknown): TechnologyPlatformItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_TECHNOLOGY_PLATFORM_SECTION.items];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TECHNOLOGY_PLATFORM_SECTION.items[index] ?? {
      name: "",
      description: "",
      icon: "gps" as PlatformIconKey,
    };

    return {
      name: String(row.name ?? fallback.name),
      description: String(row.description ?? fallback.description),
      icon: asIcon(row.icon, fallback.icon),
    };
  });
}

export function normalizeTechnologyPlatformSectionData(
  raw: unknown
): TechnologyPlatformSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_TECHNOLOGY_PLATFORM_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_TECHNOLOGY_PLATFORM_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_TECHNOLOGY_PLATFORM_SECTION.heading_accent
    ),
    description: String(data.description ?? DEFAULT_TECHNOLOGY_PLATFORM_SECTION.description),
    items: asItems(data.items),
  };
}

export function technologyPlatformSectionToPayload(
  data: TechnologyPlatformSectionData
): Record<string, unknown> {
  return { ...data };
}
