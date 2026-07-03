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

export function richTextToParagraphs(content: string): string[] {
  if (!content.trim()) return [];
  if (content.includes("<")) return [];
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function richTextLooksLikeHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}
