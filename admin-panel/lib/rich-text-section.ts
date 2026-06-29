export type RichTextSectionData = {
  heading: string;
  content: string;
};

export const DEFAULT_RICH_TEXT_SECTION: RichTextSectionData = {
  heading: "",
  content: "",
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

export function normalizeRichTextSectionData(raw: unknown): RichTextSectionData {
  const data = asRecord(raw);

  return {
    heading: String(data.heading ?? DEFAULT_RICH_TEXT_SECTION.heading),
    content: String(data.content ?? DEFAULT_RICH_TEXT_SECTION.content),
  };
}

export function richTextSectionToPayload(data: RichTextSectionData): Record<string, unknown> {
  return { ...data };
}
