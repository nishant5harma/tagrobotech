import whatWeDeliverAboutDefaults from "@/lib/data/what-we-deliver-about.json";

export type DeliverCapabilityIcon = "wifi" | "database" | "bot" | "shield-check";

export type DeliverCapability = {
  title: string;
  description: string;
  icon: DeliverCapabilityIcon;
};

export type WhatWeDeliverAboutSectionData = {
  tagline: string;
  heading: string;
  description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  capabilities: DeliverCapability[];
};

export const DELIVER_CAPABILITY_ICON_OPTIONS: Array<{ value: DeliverCapabilityIcon; label: string }> = [
  { value: "wifi", label: "Wi-Fi / connectivity" },
  { value: "database", label: "Database" },
  { value: "bot", label: "Robot" },
  { value: "shield-check", label: "Shield check" },
];

export const DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION: WhatWeDeliverAboutSectionData =
  whatWeDeliverAboutDefaults as WhatWeDeliverAboutSectionData;

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

function asCapabilities(value: unknown): DeliverCapability[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.capabilities];
  }

  const validIcons = new Set(DELIVER_CAPABILITY_ICON_OPTIONS.map((option) => option.value));

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.capabilities[index] ?? {
      title: "",
      description: "",
      icon: "wifi" as DeliverCapabilityIcon,
    };

    const icon = String(row.icon ?? fallback.icon) as DeliverCapabilityIcon;

    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
      icon: validIcons.has(icon) ? icon : fallback.icon,
    };
  });
}

export function normalizeWhatWeDeliverAboutSectionData(
  raw: unknown
): WhatWeDeliverAboutSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.heading),
    description: String(data.description ?? DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.description),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.image_alt),
    capabilities: asCapabilities(data.capabilities),
  };
}

export function whatWeDeliverAboutSectionToPayload(
  data: WhatWeDeliverAboutSectionData
): Record<string, unknown> {
  return { ...data };
}
