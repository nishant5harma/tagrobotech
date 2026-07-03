import defaults from "@/lib/data/tools-intro-section-tools.json";

export type ToolsIntroButton = {
  text: string;
  link: string;
};

export type ToolsIntroStat = {
  value: string;
  label: string;
};

export type ToolsIntroPill = {
  title: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  anchor: string;
};

export type ToolsIntroSectionToolsData = {
  eyebrow: string;
  heading: string;
  description: string;
  stats: ToolsIntroStat[];
  primary_button: ToolsIntroButton;
  secondary_button: ToolsIntroButton;
  tagline_below: string;
  tool_pills: ToolsIntroPill[];
};

export const DEFAULT_TOOLS_INTRO_SECTION_TOOLS: ToolsIntroSectionToolsData =
  defaults as ToolsIntroSectionToolsData;

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

function asButton(value: unknown, fallback: ToolsIntroButton): ToolsIntroButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

function normalizeStats(value: unknown): ToolsIntroStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_TOOLS_INTRO_SECTION_TOOLS.stats.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_TOOLS_INTRO_SECTION_TOOLS.stats[index] ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.stats[0];
    return {
      value: String(row.value ?? fallback.value),
      label: String(row.label ?? fallback.label),
    };
  });
}

function normalizePills(value: unknown): ToolsIntroPill[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_TOOLS_INTRO_SECTION_TOOLS.tool_pills.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_TOOLS_INTRO_SECTION_TOOLS.tool_pills[index] ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.tool_pills[0];

    return {
      title: String(row.title ?? fallback.title),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      anchor: String(row.anchor ?? fallback.anchor),
    };
  });
}

export function normalizeToolsIntroSectionToolsData(raw: unknown): ToolsIntroSectionToolsData {
  const data = asRecord(raw);

  return {
    eyebrow: String(data.eyebrow ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.eyebrow),
    heading: String(data.heading ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.heading),
    description: String(data.description ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.description),
    stats: normalizeStats(data.stats),
    primary_button: asButton(data.primary_button, DEFAULT_TOOLS_INTRO_SECTION_TOOLS.primary_button),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_TOOLS_INTRO_SECTION_TOOLS.secondary_button
    ),
    tagline_below: String(data.tagline_below ?? DEFAULT_TOOLS_INTRO_SECTION_TOOLS.tagline_below),
    tool_pills: normalizePills(data.tool_pills),
  };
}

export function toolsIntroSectionToolsToPayload(
  data: ToolsIntroSectionToolsData
): Record<string, unknown> {
  return { ...data };
}
