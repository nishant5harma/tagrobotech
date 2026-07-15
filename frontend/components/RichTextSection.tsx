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
      <div className="mx-auto w-[min(94%,1100px)] px-4">
        {section.heading ? (
          <h2 className="mb-6 max-w-none text-[1.5rem] font-bold tracking-tight text-pretty text-[#0f2744]">
            {section.heading}
          </h2>
        ) : null}

        {isHtml ? (
          <div
            className="cms-rich-text max-w-none text-[15px] leading-8 text-neutral-600 [&_a]:font-medium [&_a]:text-[#f97316] [&_li]:my-1.5 [&_p]:mb-4 [&_p]:last:mb-0 [&_strong]:font-semibold [&_strong]:text-[#0f2744] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        ) : (
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[15px] leading-8 text-pretty text-neutral-600">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
