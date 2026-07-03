import type { ComponentType } from "react";
import { Bot, Database, ShieldCheck, Wifi } from "lucide-react";
import { resolveCmsMediaUrl } from "@/lib/cms";

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
  image_url?: string | null;
  capabilities: DeliverCapability[];
};

export const DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION: WhatWeDeliverAboutSectionData = {
  tagline: "What We Deliver",
  heading: "End-to-end execution, from tags to reconciled truth",
  description:
    "By introducing robotics in our portfolio, we automated business processes such as physical verification and reconciliations. Clients can verify and reconcile millions of quantities in hours instead of months.",
  image_media_id: null,
  image_src: "/assets-images/landbank_tracking.jpeg",
  image_alt: "Cross-site field intelligence",
  capabilities: [
    {
      title: "Multi-technology stack",
      description:
        "RFID, NFC, Bluetooth, Beacon, GPS, hybrid devices, and software journeys designed around the real use case.",
      icon: "wifi",
    },
    {
      title: "Operational intelligence",
      description:
        "We capture movement, conditions, and field behavior so clients can act on insights, not just location.",
      icon: "database",
    },
    {
      title: "Robotics-led verification",
      description:
        "Business processes like physical verification and reconciliation can now happen at a scale and speed that was not previously practical.",
      icon: "bot",
    },
    {
      title: "ERP-ready integration",
      description:
        "Our application layer syncs cleanly with ERP systems, enabling seamless data transfer and more reliable reporting.",
      icon: "shield-check",
    },
  ],
};

const ICON_COMPONENTS: Record<DeliverCapabilityIcon, ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  database: Database,
  bot: Bot,
  "shield-check": ShieldCheck,
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

function asCapabilities(value: unknown): DeliverCapability[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.capabilities];
  }

  const validIcons = new Set(Object.keys(ICON_COMPONENTS));

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION.capabilities[index] ?? {
      title: "",
      description: "",
      icon: "wifi" as DeliverCapabilityIcon,
    };

    const icon = String(row.icon ?? fallback.icon);

    return {
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
      icon: (validIcons.has(icon) ? icon : fallback.icon) as DeliverCapabilityIcon,
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
    image_url: data.image_url ? String(data.image_url) : null,
    capabilities: asCapabilities(data.capabilities),
  };
}

export function mergeWhatWeDeliverAboutSectionData(
  cmsData: WhatWeDeliverAboutSectionData | null
): WhatWeDeliverAboutSectionData {
  if (!cmsData) return DEFAULT_WHAT_WE_DELIVER_ABOUT_SECTION;
  return normalizeWhatWeDeliverAboutSectionData(cmsData);
}

export function whatWeDeliverImageSrc(section: WhatWeDeliverAboutSectionData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}

export function resolveDeliverCapabilityIcon(icon: DeliverCapabilityIcon) {
  return ICON_COMPONENTS[icon] ?? Wifi;
}
