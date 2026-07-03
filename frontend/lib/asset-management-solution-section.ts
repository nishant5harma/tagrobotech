import { resolveCmsMediaUrl } from "@/lib/cms";

export type AssetSolutionButton = {
  text: string;
  link: string;
};

export type AssetSolutionFeature = {
  title: string;
  description: string;
};

export type AssetSolutionTab = {
  id: string;
  label: string;
  panel_heading: string;
  panel_description: string;
  features: AssetSolutionFeature[];
  cta_button: AssetSolutionButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
};

export type AssetManagementSolutionSectionData = {
  heading: string;
  heading_accent: string;
  description: string;
  tabs: AssetSolutionTab[];
};

export const DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION: AssetManagementSolutionSectionData = {
  heading: "Scalable & Future-Ready",
  heading_accent: "Asset Management Software Solution",
  description:
    "Tag RoBo Tech's asset management software delivers a robust, scalable solution to streamline operations, ensure regulatory compliance, and maximize asset life cycle performance.",
  tabs: [
    {
      id: "enterprise-asset-management",
      label: "Enterprise Asset Management",
      panel_heading: "Enterprise Asset Management Software",
      panel_description:
        "Tag RoBo Tech's Enterprise Asset Management Software centralizes and automates asset operations and maintenance workflows.",
      features: [
        {
          title: "Centralized asset management system",
          description: "Manage assets, locations, and maintenance from one unified platform.",
        },
        {
          title: "Real-time insights and predictive analytics",
          description:
            "Track performance trends and anticipate maintenance needs before downtime occurs.",
        },
        {
          title: "Automated tracking and monitoring",
          description: "Automate audits, alerts, and compliance checks across your asset portfolio.",
        },
      ],
      cta_button: { text: "Complete control", link: "/contact" },
      image_media_id: null,
      image_src: "/assets-images/laptop.png",
      image_alt: "Enterprise asset management dashboard",
    },
    {
      id: "real-time-asset-tracking",
      label: "Real Time Asset Tracking",
      panel_heading: "Real Time Asset Tracking Software",
      panel_description:
        "Gain live visibility into asset movement, status, and utilization across sites with RFID, BLE, and IoT integrations.",
      features: [
        {
          title: "Live location and status updates",
          description: "See where assets are and how they are being used in real time.",
        },
        {
          title: "Multi-site visibility",
          description:
            "Monitor assets across warehouses, plants, and remote locations from one dashboard.",
        },
        {
          title: "Automated alerts and notifications",
          description: "Get instant alerts for missing, overdue, or underutilized assets.",
        },
      ],
      cta_button: { text: "Complete control", link: "/contact" },
      image_media_id: null,
      image_src: "/assets-images/laptop.png",
      image_alt: "Real time asset tracking dashboard",
    },
    {
      id: "it-asset-tracking",
      label: "IT Asset Tracking",
      panel_heading: "IT Asset Tracking Software",
      panel_description:
        "Track laptops, servers, peripherals, and software licenses with complete lifecycle visibility and audit readiness.",
      features: [
        {
          title: "Hardware and software inventory",
          description: "Maintain a single source of truth for all IT assets and assignments.",
        },
        {
          title: "Compliance and audit trails",
          description: "Generate audit-ready reports with complete assignment and change history.",
        },
        {
          title: "Lifecycle and warranty tracking",
          description: "Plan refreshes and renewals with automated warranty and contract reminders.",
        },
      ],
      cta_button: { text: "Complete control", link: "/contact" },
      image_media_id: null,
      image_src: "/assets-images/laptop.png",
      image_alt: "IT asset tracking dashboard",
    },
    {
      id: "asset-utilization",
      label: "Asset Utilization",
      panel_heading: "Asset Utilization Software",
      panel_description:
        "Measure utilization, reduce idle assets, and optimize capital spend with actionable utilization analytics.",
      features: [
        {
          title: "Utilization dashboards",
          description: "Identify underused assets and reallocate resources where they deliver the most value.",
        },
        {
          title: "Cost and ROI insights",
          description: "Understand total cost of ownership and return on asset investments.",
        },
        {
          title: "Capacity planning support",
          description: "Use utilization trends to guide procurement and retirement decisions.",
        },
      ],
      cta_button: { text: "Complete control", link: "/contact" },
      image_media_id: null,
      image_src: "/assets-images/laptop.png",
      image_alt: "Asset utilization dashboard",
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

function asButton(value: unknown, fallback: AssetSolutionButton): AssetSolutionButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function asFeatures(value: unknown): AssetSolutionFeature[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const title = String(row.title ?? "").trim();
      if (!title) return null;

      return {
        title,
        description: String(row.description ?? ""),
      };
    })
    .filter(Boolean) as AssetSolutionFeature[];
}

function asTabs(value: unknown): AssetSolutionTab[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const label = String(row.label ?? `Tab ${index + 1}`);
    const id = String(row.id ?? label.toLowerCase().replace(/\s+/g, "-"));

    return {
      id,
      label,
      panel_heading: String(row.panel_heading ?? label),
      panel_description: String(row.panel_description ?? ""),
      features: asFeatures(row.features),
      cta_button: asButton(row.cta_button, { text: "Complete control", link: "/contact" }),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? "/assets-images/laptop.png"),
      image_alt: String(row.image_alt ?? `${label} dashboard`),
      image_url: row.image_url ? String(row.image_url) : null,
    };
  });
}

export function normalizeAssetManagementSolutionSectionData(
  raw: unknown
): AssetManagementSolutionSectionData {
  const data = asRecord(raw);
  const tabs = asTabs(data.tabs);

  return {
    heading: String(data.heading ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.description
    ),
    tabs: tabs.length > 0 ? tabs : DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.tabs,
  };
}

export function mergeAssetManagementSolutionSectionData(
  cmsData: AssetManagementSolutionSectionData | null | undefined
): AssetManagementSolutionSectionData {
  if (!cmsData) return DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION;
  return normalizeAssetManagementSolutionSectionData(cmsData);
}

export function assetSolutionImageSrc(tab: AssetSolutionTab): string {
  if (tab.image_url) return resolveCmsMediaUrl(tab.image_url);
  return tab.image_src;
}
