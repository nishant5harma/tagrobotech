import defaults from "@/lib/data/tools-flagship-section-tools.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type ToolsFlagshipHowItWorksStep = {
  step: string;
  text: string;
};

export type ToolsFlagshipItem = {
  number: string;
  badge: string;
  title: string;
  summary: string;
  description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  anchor: string;
  tags: string[];
  highlights: string[];
  how_it_works: ToolsFlagshipHowItWorksStep[];
  deploy_text: string;
  deploy_link: string;
};

export type ToolsFlagshipSectionToolsData = {
  tagline: string;
  heading: string;
  description: string;
  tools: ToolsFlagshipItem[];
};

export const DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS: ToolsFlagshipSectionToolsData =
  defaults as ToolsFlagshipSectionToolsData;

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

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || value.length === 0) return [...fallback];
  return value.map((item) => String(item ?? ""));
}

function normalizeHowItWorks(value: unknown, fallback: ToolsFlagshipHowItWorksStep[]): ToolsFlagshipHowItWorksStep[] {
  if (!Array.isArray(value) || value.length === 0) return fallback.map((item) => ({ ...item }));

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fb = fallback[index] ?? { step: String(index + 1), text: "" };
    return {
      step: String(row.step ?? fb.step),
      text: String(row.text ?? fb.text),
    };
  });
}

function normalizeTools(value: unknown): ToolsFlagshipItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.tools.map((item) => ({
      ...item,
      tags: [...item.tags],
      highlights: [...item.highlights],
      how_it_works: item.how_it_works.map((step) => ({ ...step })),
    }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.tools[index] ?? DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.tools[0];

    return {
      number: String(row.number ?? fallback.number),
      badge: String(row.badge ?? fallback.badge),
      title: String(row.title ?? fallback.title),
      summary: String(row.summary ?? fallback.summary),
      description: String(row.description ?? fallback.description),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_url: row.image_url ? String(row.image_url) : null,
      anchor: String(row.anchor ?? fallback.anchor),
      tags: normalizeStringArray(row.tags, fallback.tags),
      highlights: normalizeStringArray(row.highlights, fallback.highlights),
      how_it_works: normalizeHowItWorks(row.how_it_works, fallback.how_it_works),
      deploy_text: String(row.deploy_text ?? fallback.deploy_text),
      deploy_link: String(row.deploy_link ?? fallback.deploy_link),
    };
  });
}

export function normalizeToolsFlagshipSectionToolsData(raw: unknown): ToolsFlagshipSectionToolsData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.tagline),
    heading: String(data.heading ?? DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.heading),
    description: String(data.description ?? DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS.description),
    tools: normalizeTools(data.tools),
  };
}

export function toolsFlagshipSectionToolsToPayload(
  data: ToolsFlagshipSectionToolsData
): Record<string, unknown> {
  return { ...data };
}

export function mergeToolsFlagshipSectionToolsData(
  cmsData: ToolsFlagshipSectionToolsData | null
): ToolsFlagshipSectionToolsData {
  if (!cmsData) return DEFAULT_TOOLS_FLAGSHIP_SECTION_TOOLS;
  return normalizeToolsFlagshipSectionToolsData(cmsData);
}

export function toolsFlagshipImageSrc(tool: ToolsFlagshipItem): string {
  if (tool.image_url) return resolveCmsMediaUrl(tool.image_url);
  return tool.image_src;
}
