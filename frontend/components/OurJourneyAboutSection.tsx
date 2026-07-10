"use client";

import CmsImage from "@/components/CmsImage";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  journeyItemImageSrc,
  mergeOurJourneyAboutSectionData,
  type OurJourneyAboutSectionData,
  type OurJourneyItem,
} from "@/lib/our-journey-about-section";

type OurJourneyAboutSectionProps = {
  data?: OurJourneyAboutSectionData | null;
};

function JourneyCard({ item }: { item: OurJourneyItem }) {
  const imageSrc = journeyItemImageSrc(item);
  const isContain = item.image_fit === "contain";

  return (
    <div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-[#0d203a] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative h-full min-h-[260px]">
        <CmsImage
          src={imageSrc}
          alt={item.image_alt}
          width={1400}
          height={900}
          className={
            isContain
              ? "h-full min-h-[260px] w-full bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] object-contain p-6 sm:p-8"
              : "h-[260px] w-full object-cover lg:h-full lg:min-h-[320px]"
          }
          unoptimized={isContain}
        />
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-300">
          {item.year}
        </p>
        <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.3rem)] font-bold leading-tight tracking-tight text-white">
          {item.title}
        </h3>
        <p className="mt-5 max-w-xl text-[15px] leading-8 text-white/72 sm:text-[16px]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function OurJourneyAboutSection({ data }: OurJourneyAboutSectionProps) {
  const section = mergeOurJourneyAboutSectionData(data ?? null);
  const items = section.items;
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = useMemo(
    () => items[activeIndex] ?? items[0],
    [items, activeIndex]
  );

  if (!activeItem) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-[#081628] py-16 text-white sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 15%, rgba(249,115,22,0.22), transparent 22%), radial-gradient(circle at 88% 78%, rgba(56,189,248,0.12), transparent 22%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-[min(92%,1320px)] px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
            {section.tagline}
          </p>
          <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-bold leading-[1.02] tracking-tight">
            {section.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-white/72 sm:text-[16px]">
            {section.description}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1))
              }
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white sm:h-11 sm:w-11"
              aria-label="Previous journey milestone"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative min-w-0 flex-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative flex min-w-[min(100%,560px)] items-center justify-between gap-2 sm:min-w-full sm:gap-0">
                <div
                  className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/12"
                  aria-hidden="true"
                />
                {items.map((step, index) => (
                  <button
                    key={`${step.year}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative z-10 shrink-0 px-1 text-center transition-all duration-300 sm:px-2 ${
                      activeIndex === index
                        ? "text-[#f97316]"
                        : "text-white/28 hover:text-white/55"
                    }`}
                    aria-pressed={activeIndex === index}
                  >
                    <span
                      className={`block font-bold leading-none tracking-tight transition-all duration-300 ${
                        activeIndex === index
                          ? "text-[clamp(1.75rem,4.5vw,3.25rem)]"
                          : "text-[clamp(1rem,2.2vw,1.45rem)]"
                      }`}
                    >
                      {step.year}
                    </span>
                    {activeIndex === index ? (
                      <span className="absolute left-1/2 top-[calc(100%+0.65rem)] h-2 w-2 -translate-x-1/2 rounded-full bg-[#f97316]" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1))
              }
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white sm:h-11 sm:w-11"
              aria-label="Next journey milestone"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <motion.div
            key={`${activeItem.year}-${activeIndex}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-12"
          >
            <div className="mx-auto hidden h-0 w-0 border-x-[16px] border-b-[18px] border-x-transparent border-b-white/8 sm:block" />
            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/6 p-3 shadow-[0_26px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-4">
              <JourneyCard item={activeItem} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
