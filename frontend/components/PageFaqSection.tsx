"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  mergePageFaqSectionData,
  type PageFaqSectionData,
} from "@/lib/page-faq-section";

type PageFaqSectionProps = {
  data?: PageFaqSectionData | null;
};

export default function PageFaqSection({ data }: PageFaqSectionProps) {
  const section = mergePageFaqSectionData(data);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fff7f3_100%)] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="mx-auto max-w-3xl text-center">
          {section.tagline ? (
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#f97316]">
              {section.tagline}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-[#111827]">
            {section.heading}{" "}
            {section.heading_accent ? (
              <span className="text-[#f97316]">{section.heading_accent}</span>
            ) : null}
          </h2>
          {section.description ? (
            <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              {section.description}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-10 max-w-3xl border-t border-neutral-200">
          {section.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={`${item.question}-${index}`} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-[#111827] sm:text-[16px]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && item.answer ? (
                  <p className="pb-5 pr-8 text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
