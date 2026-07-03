export type ArticleBodySectionData = {
  heading: string;
  content: string;
};

export const DEFAULT_ARTICLE_BODY_SECTION: ArticleBodySectionData = {
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

export function normalizeArticleBodySectionData(raw: unknown): ArticleBodySectionData {
  const data = asRecord(raw);

  return {
    heading: String(data.heading ?? DEFAULT_ARTICLE_BODY_SECTION.heading),
    content: String(data.content ?? DEFAULT_ARTICLE_BODY_SECTION.content),
  };
}

export function articleBodySectionToPayload(
  data: ArticleBodySectionData
): Record<string, unknown> {
  return { ...data };
}
