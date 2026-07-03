import type { LucideIcon } from "lucide-react";
import {
  Barcode,
  Bluetooth,
  MapPinned,
  QrCode,
  Radio,
  SmartphoneNfc,
} from "lucide-react";

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

const ICON_ACCENTS: Record<PlatformIconKey, string> = {
  gps: "from-sky-500/20 via-sky-500/8 to-transparent",
  bluetooth: "from-violet-500/20 via-violet-500/8 to-transparent",
  rfid: "from-orange-500/20 via-orange-500/8 to-transparent",
  nfc: "from-emerald-500/20 via-emerald-500/8 to-transparent",
  qr_code: "from-fuchsia-500/20 via-fuchsia-500/8 to-transparent",
  barcode: "from-slate-500/20 via-slate-500/8 to-transparent",
};

const ICON_COMPONENTS: Record<PlatformIconKey, LucideIcon> = {
  gps: MapPinned,
  bluetooth: Bluetooth,
  rfid: Radio,
  nfc: SmartphoneNfc,
  qr_code: QrCode,
  barcode: Barcode,
};

export const DEFAULT_TECHNOLOGY_PLATFORM_SECTION: TechnologyPlatformSectionData = {
  tagline: "Technology Platform",
  heading: "Our Team has Delivered Projects Across Following",
  heading_accent: "Technology Platforms",
  description:
    "A flexible platform mix lets us build the right tracking stack for movement, proximity, read-range, and operational intelligence.",
  items: [
    {
      name: "GPS",
      description:
        "GPS devices are fitted to track via network of satellites. Most suited for items which are on the move.",
      icon: "gps",
    },
    {
      name: "Bluetooth",
      description:
        "Bluetooth devices are fitted to identify location via radio transmission. Most suited for items within certain premises/ blue tooth range.",
      icon: "bluetooth",
    },
    {
      name: "RFID",
      description:
        "RFID Tag transit data via radio frequency and most suited for factories, offices, items within read range of upto 10~15Mtrs.",
      icon: "rfid",
    },
    {
      name: "NFC",
      description:
        "NFC expands upon the models of High-frequency RFID and transforms the constraints of its working recurrence into a remarkable component of near-field communication.",
      icon: "nfc",
    },
    {
      name: "QR Code",
      description:
        "Quick Response Codes can hold larger information and have better readability.",
      icon: "qr_code",
    },
    {
      name: "Bar Code",
      description: "Simplest form of data storage in machine readable form.",
      icon: "barcode",
    },
  ],
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

function asIcon(value: unknown, fallback: PlatformIconKey): PlatformIconKey {
  const icon = String(value ?? fallback);
  return ICON_COMPONENTS[icon as PlatformIconKey] ? (icon as PlatformIconKey) : fallback;
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

export function mergeTechnologyPlatformSectionData(
  cmsData: TechnologyPlatformSectionData | null
): TechnologyPlatformSectionData {
  if (!cmsData) return DEFAULT_TECHNOLOGY_PLATFORM_SECTION;
  return normalizeTechnologyPlatformSectionData(cmsData);
}

export type ResolvedPlatform = TechnologyPlatformItem & {
  iconComponent: LucideIcon;
  accent: string;
};

export function resolvePlatforms(section: TechnologyPlatformSectionData): ResolvedPlatform[] {
  return section.items.map((item) => ({
    ...item,
    iconComponent: ICON_COMPONENTS[item.icon],
    accent: ICON_ACCENTS[item.icon],
  }));
}
