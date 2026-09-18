/**
 * Normalize CMS rich HTML that was pasted as escaped source
 * (e.g. `<p>&lt;h1&gt;Title&lt;/h1&gt;</p>` from GPT/Gemini HTML dumps).
 */

function decodeHtmlEntities(value: string): string {
  let decoded = value;
  for (let i = 0; i < 3; i++) {
    if (!/&(?:amp|lt|gt|quot|#39|#x27);/i.test(decoded)) break;
    decoded = decoded
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#(?:39|x27);/gi, "'")
      .replace(/&amp;/gi, "&");
  }
  return decoded;
}

function looksEscapedHtmlSource(html: string): boolean {
  return /&lt;\s*\/?\s*[a-zA-Z!]/.test(html);
}

function stripSeoMetadataAppendix(html: string): string {
  return html
    .replace(/<hr\s*\/?>\s*<h2[^>]*>\s*SEO Metadata[\s\S]*$/i, "")
    .replace(/<h2[^>]*>\s*SEO Metadata[\s\S]*$/i, "")
    .trim();
}

export function repairEscapedCmsHtml(html: string): string {
  const input = String(html ?? "").trim();
  if (!input) return "";

  if (!looksEscapedHtmlSource(input)) {
    return stripSeoMetadataAppendix(input);
  }

  const parts: string[] = [];
  const paragraphRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let matchedParagraph = false;

  while ((match = paragraphRe.exec(input)) !== null) {
    matchedParagraph = true;
    if (match.index > lastIndex) {
      const gap = decodeHtmlEntities(input.slice(lastIndex, match.index)).trim();
      if (gap) parts.push(gap);
    }

    let inner = decodeHtmlEntities(match[1] ?? "");
    inner = inner
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (inner) parts.push(inner);
    lastIndex = paragraphRe.lastIndex;
  }

  if (lastIndex < input.length) {
    const tail = decodeHtmlEntities(input.slice(lastIndex)).trim();
    if (tail) parts.push(tail);
  }

  let repaired = matchedParagraph
    ? parts.join("\n")
    : decodeHtmlEntities(input);

  repaired = repaired
    .replace(/<\/?article\b[^>]*>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return stripSeoMetadataAppendix(repaired);
}
