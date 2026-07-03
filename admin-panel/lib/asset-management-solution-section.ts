import assetManagementSolutionDefaults from "@/lib/data/asset-management-solution.json";
import type {
  AssetManagementSolutionSectionData,
  AssetSolutionButton,
  AssetSolutionFeature,
  AssetSolutionTab,
} from "@/lib/asset-management-solution-section-types";

export type {
  AssetManagementSolutionSectionData,
  AssetSolutionButton,
  AssetSolutionFeature,
  AssetSolutionTab,
} from "@/lib/asset-management-solution-section-types";

export const DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION: AssetManagementSolutionSectionData =
  assetManagementSolutionDefaults as AssetManagementSolutionSectionData;

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
    return DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.tabs.map((tab) => ({ ...tab }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const label = String(row.label ?? `Tab ${index + 1}`);

    return {
      id: String(row.id ?? label.toLowerCase().replace(/\s+/g, "-")),
      label,
      panel_heading: String(row.panel_heading ?? label),
      panel_description: String(row.panel_description ?? ""),
      features: asFeatures(row.features),
      cta_button: asButton(row.cta_button, { text: "Complete control", link: "/contact" }),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? "/assets-images/laptop.png"),
      image_alt: String(row.image_alt ?? `${label} dashboard`),
    };
  });
}

export function normalizeAssetManagementSolutionSectionData(
  raw: unknown
): AssetManagementSolutionSectionData {
  const data = asRecord(raw);

  return {
    heading: String(data.heading ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.heading),
    heading_accent: String(
      data.heading_accent ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.heading_accent
    ),
    description: String(
      data.description ?? DEFAULT_ASSET_MANAGEMENT_SOLUTION_SECTION.description
    ),
    tabs: asTabs(data.tabs),
  };
}

export function assetManagementSolutionSectionToPayload(
  data: AssetManagementSolutionSectionData
): Record<string, unknown> {
  return { ...data };
}
