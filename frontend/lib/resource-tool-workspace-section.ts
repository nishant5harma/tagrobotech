import resourceToolWorkspaceDefaults from "@/lib/data/resource-tool-workspace.json";

export type ResourceToolType = "roi" | "maintenance" | "qr" | "barcode";

export type ResourceToolField = {
  id: string;
  label: string;
  placeholder: string;
  suffix: string;
};

export type ResourceToolButton = {
  text: string;
  link: string;
};

export type ResourceToolWorkspaceSectionData = {
  tool_type: ResourceToolType;
  tagline: string;
  heading: string;
  description: string;
  primary_button: ResourceToolButton;
  fields: ResourceToolField[];
  result_heading: string;
  result_helper: string;
};

export const DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION: ResourceToolWorkspaceSectionData =
  resourceToolWorkspaceDefaults as ResourceToolWorkspaceSectionData;

const TOOL_TYPES: ResourceToolType[] = ["roi", "maintenance", "qr", "barcode"];

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

function normalizeFields(value: unknown): ResourceToolField[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.fields];
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.fields[index] ?? {
      id: `field_${index + 1}`,
      label: "",
      placeholder: "",
      suffix: "",
    };
    return {
      id: String(row.id ?? fallback.id),
      label: String(row.label ?? fallback.label),
      placeholder: String(row.placeholder ?? fallback.placeholder),
      suffix: String(row.suffix ?? fallback.suffix),
    };
  });
}

function normalizeButton(value: unknown, fallback: ResourceToolButton): ResourceToolButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizeResourceToolWorkspaceSectionData(
  raw: unknown
): ResourceToolWorkspaceSectionData {
  const data = asRecord(raw);
  const toolTypeRaw = String(
    data.tool_type ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.tool_type
  ) as ResourceToolType;
  const tool_type = TOOL_TYPES.includes(toolTypeRaw)
    ? toolTypeRaw
    : DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.tool_type;

  return {
    tool_type,
    tagline: String(data.tagline ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.heading),
    description: String(
      data.description ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.description
    ),
    primary_button: normalizeButton(
      data.primary_button,
      DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.primary_button
    ),
    fields: normalizeFields(data.fields),
    result_heading: String(
      data.result_heading ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.result_heading
    ),
    result_helper: String(
      data.result_helper ?? DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION.result_helper
    ),
  };
}

export function resourceToolWorkspaceSectionToPayload(
  data: ResourceToolWorkspaceSectionData
): Record<string, unknown> {
  return { ...data };
}

export function mergeResourceToolWorkspaceSectionData(
  cmsData: ResourceToolWorkspaceSectionData | null | undefined
): ResourceToolWorkspaceSectionData {
  if (!cmsData) return DEFAULT_RESOURCE_TOOL_WORKSPACE_SECTION;
  return normalizeResourceToolWorkspaceSectionData(cmsData);
}
