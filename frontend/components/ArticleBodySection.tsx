"use client";

import { normalizeArticleBodySectionData } from "@/lib/article-body-section";
import { sanitizeCmsHtml } from "@/lib/cms-html";

type ArticleBodySectionProps = {
  data: unknown;
};

export default function ArticleBodySection({ data }: ArticleBodySectionProps) {
  const section = normalizeArticleBodySectionData(data);
  const html = sanitizeCmsHtml(section.content);

  if (!html.trim()) return null;

  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-[min(92%,860px)] px-4">
        {section.heading ? (
          <h2 className="mb-6 text-[1.75rem] font-bold tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
        ) : null}

        <div
          className="cms-rich-text max-w-none text-[15px] leading-8 text-neutral-700"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
