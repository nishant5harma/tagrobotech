"use client";

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
  const paragraphs = richTextToParagraphs(section.content);
  const isHtml = richTextLooksLikeHtml(section.content);

  if (!section.content.trim()) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto w-[min(92%,900px)] px-4">
        {section.heading ? (
          <h2 className="mb-6 text-[1.5rem] font-bold tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
        ) : null}

        {isHtml ? (
          <div
            className="prose prose-neutral max-w-none text-[15px] leading-8 prose-headings:text-[#0f2744] prose-a:text-[#f97316]"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        ) : (
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[15px] leading-8 text-neutral-600">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
