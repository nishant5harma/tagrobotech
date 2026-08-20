"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import {
  mergeCaseStudySectionData,
  resolveCaseStudyImage,
  type CaseStudyItem,
  type CaseStudySectionData,
} from "@/lib/case-study-section";

type CaseStudySectionProps = {
  data?: CaseStudySectionData | null;
};

function CaseStudyCard({
  item,
  readMoreChars,
}: {
  item: CaseStudyItem;
  readMoreChars: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const imageSrc = resolveCaseStudyImage(item);
  const needsTruncate = item.excerpt.length > readMoreChars;
  const visibleText =
    !needsTruncate || expanded
      ? item.excerpt
      : `${item.excerpt.slice(0, readMoreChars).trimEnd()}…`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#e8ecf3] bg-white shadow-[0_18px_40px_rgba(15,39,68,0.06)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f5f9]">
        <Image
          src={imageSrc}
          alt={item.image_alt || item.title}
          fill
          unoptimized={
            imageSrc.startsWith("http://localhost") || imageSrc.startsWith("/uploads/")
          }
          className="object-cover transition duration-500 hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {(item.industry || item.client) && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f97316]">
            {[item.industry, item.client].filter(Boolean).join(" · ")}
          </p>
        )}

        <h3 className="mt-3 text-[1.15rem] font-bold leading-snug tracking-tight text-[#0f2744] sm:text-[1.25rem]">
          {item.title}
        </h3>

        <p className="mt-3 flex-1 text-[14px] leading-7 text-[#4b5563] sm:text-[15px]">
          {visibleText}
        </p>

        {needsTruncate ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1 self-start text-[13px] font-semibold text-[#f97316] transition hover:text-[#ea580c]"
          >
            {expanded ? (
              <>
                Read less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        ) : null}

        {item.link && item.link_text ? (
          <div className="mt-5 border-t border-[#eef1f6] pt-5">
            {item.link.startsWith("http") ? (
              <a
                href={item.link}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#0f2744] transition hover:text-[#f97316]"
              >
                {item.link_text}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <Link
                href={item.link}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#0f2744] transition hover:text-[#f97316]"
              >
                {item.link_text}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function CaseStudySection({ data }: CaseStudySectionProps) {
  const section = mergeCaseStudySectionData(data);

  return (
    <section className="bg-[#f7f8fb] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="mx-auto max-w-3xl text-center">
          {section.tagline ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f97316]">
              {section.tagline}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-tight tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
          {section.description ? (
            <p className="mt-4 text-[15px] leading-7 text-[#4b5563] sm:text-[16px]">
              {section.description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {section.items.map((item) => (
            <CaseStudyCard
              key={item.id}
              item={item}
              readMoreChars={section.read_more_chars}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
