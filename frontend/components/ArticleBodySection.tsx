"use client";

import { normalizeArticleBodySectionData } from "@/lib/article-body-section";

type ArticleBodySectionProps = {
  data: unknown;
};

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export default function ArticleBodySection({ data }: ArticleBodySectionProps) {
  const section = normalizeArticleBodySectionData(data);

  if (!section.content.trim()) return null;

  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-[min(92%,860px)] px-4">
        {section.heading ? (
          <h2 className="mb-6 text-[1.75rem] font-bold tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
        ) : null}

        <div
          className="prose prose-neutral max-w-none text-[15px] leading-8 prose-headings:text-[#0f2744] prose-a:text-[#f97316] prose-img:rounded-2xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
        />
      </div>
    </section>
  );
}
