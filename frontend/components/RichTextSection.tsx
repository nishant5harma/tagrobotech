"use client";

import { sanitizeCmsHtml } from "@/lib/cms-html";
import {
  normalizeRichTextSectionData,
  richTextLooksLikeHtml,
  richTextToParagraphs,
} from "@/lib/rich-text-section";

type RichTextSectionProps = {
  data: unknown;
};

export default function RichTextSection({ data }: RichTextSectionProps) {
  const section = normalizeRichTextSectionData(data);
  const html = sanitizeCmsHtml(section.content);
  const paragraphs = richTextToParagraphs(html);
  const isHtml = richTextLooksLikeHtml(html);

  if (!html.trim()) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-[min(94%,1100px)] px-4">
        {section.heading ? (
          <h2 className="mb-7 max-w-none text-[clamp(1.75rem,3.2vw,2.35rem)] font-bold tracking-tight text-pretty text-[#0f2744] sm:mb-8">
            {section.heading}
          </h2>
        ) : null}

        {isHtml ? (
          <div
            className="cms-rich-text max-w-none text-[17px] leading-9 text-neutral-600 sm:text-[18px] sm:leading-9"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[17px] leading-9 text-pretty text-neutral-600 sm:text-[18px] sm:leading-9"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
