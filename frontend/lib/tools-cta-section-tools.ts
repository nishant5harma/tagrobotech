import defaults from "@/lib/data/tools-cta-section-tools.json";

export type ToolsCtaButton = {
  text: string;
  link: string;
};

export type ToolsCtaSectionToolsData = {
  tagline: string;
  heading: string;
  description: string;
  primary_button: ToolsCtaButton;
  secondary_button: ToolsCtaButton;
};

export const DEFAULT_TOOLS_CTA_SECTION_TOOLS: ToolsCtaSectionToolsData =
  defaults as ToolsCtaSectionToolsData;

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

function asButton(value: unknown, fallback: ToolsCtaButton): ToolsCtaButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizeToolsCtaSectionToolsData(raw: unknown): ToolsCtaSectionToolsData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_TOOLS_CTA_SECTION_TOOLS.tagline),
    heading: String(data.heading ?? DEFAULT_TOOLS_CTA_SECTION_TOOLS.heading),
    description: String(data.description ?? DEFAULT_TOOLS_CTA_SECTION_TOOLS.description),
    primary_button: asButton(data.primary_button, DEFAULT_TOOLS_CTA_SECTION_TOOLS.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_TOOLS_CTA_SECTION_TOOLS.secondary_button
    ),
  };
}

export function toolsCtaSectionToolsToPayload(
  data: ToolsCtaSectionToolsData
): Record<string, unknown> {
  return { ...data };
}

export function mergeToolsCtaSectionToolsData(
  cmsData: ToolsCtaSectionToolsData | null
): ToolsCtaSectionToolsData {
  if (!cmsData) return DEFAULT_TOOLS_CTA_SECTION_TOOLS;
  return normalizeToolsCtaSectionToolsData(cmsData);
}
